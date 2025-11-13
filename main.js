// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 🔥 Tự reload khi có thay đổi trong thư mục renderer hoặc main
require('electron-reload')(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`)
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);
