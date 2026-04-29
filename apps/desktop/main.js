const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let pythonProcess;
const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';

function startPythonEngine() {
  const enginePath = path.join(__dirname, '../../engine');
  
  // Use virtual environment python
  const pythonExecutable = path.join(enginePath, '.venv', 'bin', 'python3');
  pythonProcess = spawn(pythonExecutable, ['main.py'], {
    cwd: enginePath,
    stdio: 'inherit'
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start python process.', err);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      if (!isMainFrame) return;
      const delay = 750;
      console.warn(`Dev server load failed (${errorCode}: ${errorDescription}). Retrying in ${delay}ms...`);
      setTimeout(() => loadDevServer(1), delay);
    });
    mainWindow.webContents.on('render-process-gone', (event, details) => {
      console.error('Renderer process gone:', details);
    });
  }

  // In development, load from Vite dev server
  if (isDev) {
    loadDevServer(0);
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

function loadDevServer(retryCount) {
  if (!mainWindow) return;

  mainWindow.loadURL(DEV_SERVER_URL).catch((err) => {
    const delay = Math.min(5000, 500 + retryCount * 500);
    console.warn(`Dev server not ready (${err?.message || 'unknown error'}). Retrying in ${delay}ms...`);
    setTimeout(() => loadDevServer(retryCount + 1), delay);
  });
}

app.whenReady().then(() => {
  startPythonEngine();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (pythonProcess) {
    pythonProcess.kill();
  }
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers
const { dialog } = require('electron');

ipcMain.handle('dialog:openDirectory', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

ipcMain.handle('editor:open', async (event, filePath, line) => {
  // Using VS Code as default for Phase 1
  try {
    const cmd = `code --goto "${filePath}:${line}"`;
    const { exec } = require('child_process');
    exec(cmd, (err) => {
      if (err) console.error("Failed to open VS Code:", err);
    });
    return true;
  } catch (err) {
    return false;
  }
});
