const fs = require('node:fs/promises');
const path = require('node:path');
const {spawn} = require('node:child_process');
const {chromium} = require('@playwright/test');

const repositoryRoot = path.resolve(__dirname, '../..');
const assetsDir = path.join(repositoryRoot, 'assets');
const framesDir = path.join(assetsDir, '.repository-tour-frames');

function escapeHtml(text) {
  return text.replace(/[&<>]/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'}[character]));
}

function imageData(filename) {
  const extension = path.extname(filename).slice(1);
  return fs.readFile(path.join(assetsDir, filename)).then(data => `data:image/${extension};base64,${data.toString('base64')}`);
}

async function runFfmpeg(listPath, outputPath) {
  const filter = 'fps=8,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=96[p];[s1][p]paletteuse=dither=bayer';
  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-vf', filter, '-loop', '0', outputPath], {
      cwd: framesDir, windowsHide: true, stdio: ['ignore', 'ignore', 'pipe']
    });
    let errors = '';
    ffmpeg.stderr.on('data', chunk => { errors += chunk.toString(); });
    ffmpeg.once('error', reject);
    ffmpeg.once('exit', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}: ${errors}`)));
  });
}

async function main() {
  await fs.mkdir(framesDir, {recursive: true});
  const [legacy, modern, prompts, trace, report] = await Promise.all([
    fs.readFile(path.join(repositoryRoot, 'selenium-java-legacy/src/test/java/com/blueprint/LoginTest.java'), 'utf8'),
    fs.readFile(path.join(repositoryRoot, 'playwright-ts-modern/src/tests/e2e.spec.ts'), 'utf8'),
    fs.readFile(path.join(repositoryRoot, 'ai-prompts/01-cloud-migration-prompt.md'), 'utf8'),
    imageData('playwright-trace-viewer.png'),
    imageData('playwright-report.png')
  ]);

  const slides = [
    {title: 'Selenium Java → Playwright TypeScript', subtitle: 'A modernization blueprint for QA engineers', body: '<div class="journey"><span>Legacy Selenium</span><b>→</b><span>Technical debt</span><b>→</b><span>AI-assisted migration</span><b>→</b><span>Playwright</span><b>→</b><span>Visibility</span><b>→</b><span>Business outcomes</span></div>', section: 'README'},
    {title: 'Start with the legacy test', subtitle: 'Spot the debt before changing the code', code: legacy.split('\n').slice(0, 21).join('\n'), section: 'Selenium Java'},
    {title: 'Keep the business intent', subtitle: 'Use isolated state, semantic actions, and clear expectations', code: modern.split('\n').slice(0, 22).join('\n'), section: 'Playwright TypeScript'},
    {title: 'Use AI with review checkpoints', subtitle: 'Migrate one test at a time; treat model output as a draft', code: prompts.split('\n').slice(0, 18).join('\n'), section: 'AI migration prompts'},
    {title: 'Debug with the Trace Viewer', subtitle: 'Inspect actions, snapshots, and timing in one place', image: trace, section: 'Trace Viewer'},
    {title: 'Share results clearly', subtitle: 'HTML for people · JUnit for CI · JSON for integrations', image: report, section: 'Playwright report'}
  ];

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport: {width: 1280, height: 720}, deviceScaleFactor: 1});
    for (let index = 0; index < slides.length; index += 1) {
      const slide = slides[index];
      const content = slide.image
        ? `<img class="visual" src="${slide.image}" alt="${escapeHtml(slide.section)}">`
        : slide.code
          ? `<pre><code>${escapeHtml(slide.code)}</code></pre>`
          : slide.body;
      await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
        *{box-sizing:border-box}body{margin:0;width:1280px;height:720px;background:#f3f6fb;color:#172b4d;font-family:Arial,sans-serif}
        header{height:62px;padding:0 58px;background:#102a43;color:#fff;display:flex;align-items:center;justify-content:space-between;font-size:17px;letter-spacing:.04em}
        main{padding:40px 68px}h1{font-size:42px;margin:0 0 10px;color:#102a43}h2{font-size:23px;font-weight:400;color:#52677f;margin:0 0 30px}
        .panel{height:490px;background:#fff;border:1px solid #d8e0eb;border-radius:18px;padding:30px;box-shadow:0 12px 30px #102a4312;overflow:hidden}
        pre{margin:0;height:100%;overflow:hidden;white-space:pre-wrap;font:15px/1.42 Consolas,monospace;color:#20344d}
        .visual{display:block;max-width:100%;max-height:430px;margin:0 auto;object-fit:contain}.journey{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-size:23px;font-weight:700}.journey b{color:#16846b;font-size:28px}
        footer{margin-top:18px;color:#667b91;font-size:15px;display:flex;justify-content:space-between}
      </style></head><body><header><strong>MODERNIZATION BLUEPRINT</strong><span>${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}</span></header><main><h1>${escapeHtml(slide.title)}</h1><h2>${escapeHtml(slide.subtitle)}</h2><section class="panel">${content}</section><footer><span>${escapeHtml(slide.section)}</span><span>Legacy → Migration → Modernization → Visibility</span></footer></main></body></html>`);
      await page.screenshot({path: path.join(framesDir, `frame-${String(index + 1).padStart(2, '0')}.png`)});
    }
  } finally {
    await browser.close();
  }

  const concatList = [
    ...slides.map((_, index) => `file 'frame-${String(index + 1).padStart(2, '0')}.png'\nduration 4`),
    `file 'frame-${String(slides.length).padStart(2, '0')}.png'`
  ].join('\n');
  const listPath = path.join(framesDir, 'frames.txt');
  const gifPath = path.join(assetsDir, 'repository-tour.gif');
  await fs.writeFile(listPath, concatList, 'utf8');
  await runFfmpeg(listPath, gifPath);
  await fs.rm(framesDir, {recursive: true, force: true});
  console.log(`Created a 24-second repository tour at ${gifPath}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
