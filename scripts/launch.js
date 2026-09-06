const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const rootDir = path.resolve(__dirname, '..');

// 1. Ensure .env.local exists
const envLocalPath = path.join(rootDir, '.env.local');
const envExamplePath = path.join(rootDir, '.env.example');

if (!fs.existsSync(envLocalPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envLocalPath);
  console.log('✅ Created .env.local from defaults.');
}

// Function to check if a URL is responding
function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
  });
}

// Function to open browser
function openBrowser(url) {
  console.log(`🌐 Opening browser at: ${url}`);
  const platform = process.platform;
  if (platform === 'win32') {
    exec(`start "" "${url}"`);
  } else if (platform === 'darwin') {
    exec(`open "${url}"`);
  } else {
    exec(`xdg-open "${url}"`);
  }
}

async function main() {
  console.log('=====================================================');
  console.log('🌱 KisanKart 1-Click Launch Assistant');
  console.log('=====================================================');

  // Check if server is already running on port 3000
  const isAlreadyRunning = await checkUrl('http://localhost:3000');
  if (isAlreadyRunning) {
    console.log('⚡ Server is ALREADY running at http://localhost:3000!');
    openBrowser('http://localhost:3000');
    console.log('App opened in your browser. Press Ctrl+C anytime to exit.');
    return;
  }

  // Start Next.js dev server
  console.log('🚀 Starting Next.js development server...');
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  
  const devProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: rootDir,
    stdio: 'inherit',
  });

  // Poll until server is ready, then open browser
  let attempts = 0;
  const pollInterval = setInterval(async () => {
    attempts++;
    const isReady = await checkUrl('http://localhost:3000');
    if (isReady) {
      clearInterval(pollInterval);
      openBrowser('http://localhost:3000');
    } else if (attempts > 30) {
      clearInterval(pollInterval);
      console.log('⚠️ Server startup took longer than expected. Please manually visit: http://localhost:3000');
    }
  }, 1000);

  devProcess.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
  });
}

main();
