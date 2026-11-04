const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {chromium} = require('@playwright/test');

const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.resolve(projectRoot, '..', 'assets');
const reportDir = path.join(projectRoot, 'playwright-report');
const mimeTypes = {'.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml'};

async function serveReport() {
  const server = http.createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const target = path.resolve(reportDir, pathname === '/' ? './index.html' : `.${pathname}`);
    if (target !== reportDir && !target.startsWith(`${reportDir}${path.sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    try {
      const file = await fs.readFile(target);
      response.writeHead(200, {'content-type': mimeTypes[path.extname(target)] ?? 'application/octet-stream'}).end(file);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {server, url: `http://127.0.0.1:${server.address().port}/`};
}

async function main() {
  await fs.mkdir(assetsDir, {recursive: true});
  await fs.access(path.join(reportDir, 'index.html'));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}, deviceScaleFactor: 1});
    await page.goto('https://www.saucedemo.com/');
    await page.screenshot({path: path.join(assetsDir, 'legacy-selenium.png'), fullPage: true});
    await page.getByLabel('Username').fill(process.env.SAUCE_USERNAME ?? 'standard_user');
    await page.getByLabel('Password').fill(process.env.SAUCE_PASSWORD ?? 'secret_sauce');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.getByRole('button', {name: 'Add to cart'}).first().click();
    await page.getByRole('button', {name: /^Cart,/}).click();
    await page.getByRole('button', {name: 'Checkout'}).click();
    await page.getByLabel('First Name').fill('Taylor');
    await page.getByLabel('Last Name').fill('Tester');
    await page.getByLabel(/zip\/postal code/i).fill('10001');
    await page.getByRole('button', {name: 'Continue'}).click();
    await page.getByText('Checkout: Overview', {exact: true}).waitFor();
    await page.screenshot({path: path.join(assetsDir, 'saucedemo-checkout.png'), fullPage: true});

    const report = await serveReport();
    try {
      await page.goto(report.url);
      await page.waitForLoadState('networkidle');
      console.log(`Report screenshot page: ${(await page.locator('body').innerText()).slice(0, 300)}`);
      await page.screenshot({path: path.join(assetsDir, 'playwright-report.png'), fullPage: true});
    } finally {
      await new Promise(resolve => report.server.close(resolve));
    }

    const tracePath = path.join(assetsDir, '.readme-trace.zip');
    const traceContext = await browser.newContext({viewport: {width: 1440, height: 1000}});
    await traceContext.tracing.start({screenshots: true, snapshots: true});
    const tracePage = await traceContext.newPage();
    await tracePage.goto('https://www.saucedemo.com/');
    await tracePage.getByLabel('Username').fill(process.env.SAUCE_USERNAME ?? 'standard_user');
    await tracePage.getByLabel('Password').fill(process.env.SAUCE_PASSWORD ?? 'secret_sauce');
    await tracePage.getByRole('button', {name: 'Login'}).click();
    await tracePage.getByText('Products', {exact: true}).waitFor();
    await tracePage.getByRole('button', {name: 'Add to cart'}).first().click();
    await tracePage.getByRole('button', {name: 'Remove'}).waitFor();
    await traceContext.tracing.stop({path: tracePath});

    const cliPath = path.join(projectRoot, 'node_modules', 'playwright', 'cli.js');
    const viewer = spawn(process.execPath, [cliPath, 'show-trace', tracePath, '--host', '127.0.0.1', '--port', '9321'], {
      cwd: projectRoot, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
      env: {...process.env, COPILOT_CLI: '1'}
    });
    try {
      const viewerUrl = await new Promise((resolve, reject) => {
        let output = '';
        const timeout = setTimeout(() => reject(new Error(`Trace viewer did not start: ${output}`)), 20_000);
        viewer.stdout.on('data', chunk => {
          output += chunk.toString();
          const match = output.match(/Listening on (https?:\/\/[^\s]+)/);
          if (match) { clearTimeout(timeout); resolve(match[1]); }
        });
        viewer.once('error', error => { clearTimeout(timeout); reject(error); });
        viewer.once('exit', code => { if (code && !output.includes('Listening on')) { clearTimeout(timeout); reject(new Error(`Trace viewer exited (${code}): ${output}`)); } });
      });
      await page.goto(viewerUrl);
      await page.waitForFunction(() => document.body.innerText.length > 100 && !document.body.innerText.includes('Drop Playwright Trace to load'));
      await page.getByText('Navigate', {exact: true}).first().click();
      await page.screenshot({path: path.join(assetsDir, 'playwright-trace-viewer.png'), fullPage: true});
    } finally {
      viewer.kill();
      await traceContext.close();
      await fs.rm(tracePath, {force: true});
    }
    console.log(`Screenshots saved in ${assetsDir}`);
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
