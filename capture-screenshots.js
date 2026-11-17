import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('c:/Users/Atharv jadhav/Education/College File/3rd year/WT/Practical 7/node_modules/puppeteer-core');
import path from 'path';
import http from 'http';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 8092;

// Simple static server
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, async () => {
  console.log(`Screenshot server running on http://localhost:${PORT}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,920']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 920, deviceScaleFactor: 1.5 });

  try {
    // 1. Home & Event Discovery
    console.log('Capturing Figure 1: Home & Event Discovery...');
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig1_home_event_discovery.png') });

    // 2. Events Catalog & Filtering
    console.log('Capturing Figure 2: Events Catalog & Filtering...');
    await page.goto(`http://localhost:${PORT}/event.html`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig2_event_details_registration.png') });

    // 3. Dynamic QR Pass Generation
    console.log('Capturing Figure 3: Dynamic QR Registration Pass...');
    await page.goto(`http://localhost:${PORT}/scanner.html`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig3_qr_pass_generation.png') });

    // 4. Attendance Management & Live Stats
    console.log('Capturing Figure 4: Attendance Management & Live Stats...');
    await page.goto(`http://localhost:${PORT}/attendance.html`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig4_qr_scanner_attendance.png') });

    // 5. Feedback System & Analytics
    console.log('Capturing Figure 5: Feedback System & Analytics...');
    await page.goto(`http://localhost:${PORT}/feedback.html`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(__dirname, 'fig5_analytics_feedback.png') });

    console.log('All 5 figures captured successfully!');
  } catch (err) {
    console.error('Error capturing screenshots:', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});
