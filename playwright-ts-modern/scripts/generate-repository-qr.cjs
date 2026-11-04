const path = require('node:path');
const QRCode = require('qrcode');

const repositoryUrl = process.argv[2];

if (!repositoryUrl) {
  console.error('Usage: npm run qr -- https://github.com/OWNER/REPOSITORY');
  process.exit(1);
}

let parsedUrl;
try {
  parsedUrl = new URL(repositoryUrl);
} catch {
  console.error('Provide a valid public GitHub repository URL.');
  process.exit(1);
}

if (parsedUrl.protocol !== 'https:' || parsedUrl.hostname !== 'github.com' || parsedUrl.pathname.split('/').filter(Boolean).length !== 2) {
  console.error('The URL must be a public repository URL in the form https://github.com/OWNER/REPOSITORY.');
  process.exit(1);
}

const outputPath = path.resolve(__dirname, '../../assets/repository-qr.png');
QRCode.toFile(outputPath, parsedUrl.toString(), {
  errorCorrectionLevel: 'H',
  margin: 2,
  width: 512,
  color: {dark: '#102a43', light: '#ffffff'}
}).then(() => {
  console.log(`QR code saved to ${outputPath}`);
}).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
