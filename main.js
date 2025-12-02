// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 🔥 Tự reload khi có thay đổi trong thư mục renderer hoặc main (chỉ trong development)
if (!app.isPackaged) {
  try {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
      ignored: /renderer[\\/]data[\\/].*/,
    });
  } catch (error) {
    // Ignore error if electron-reload is not available
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "renderer/img/Logo_QĐNDVN.png"),
    webPreferences: {
      preload: path.join(__dirname, "renderer/preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  }); 

  win.loadFile('renderer/login.html');
}

app.whenReady().then(createWindow);
