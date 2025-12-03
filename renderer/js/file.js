const fs = require('fs');
const path = require('path');

function getDataDir() {
  // Kiểm tra nếu app được đóng gói
  const isPackaged = typeof __dirname !== 'undefined' && __dirname.includes('.asar') ||
                     (typeof app !== 'undefined' && app && app.isPackaged);
  
  if (isPackaged) {
    // Khi đóng gói (portable), lưu vào thư mục chứa file .exe
    if (typeof getAppDirectory === 'function') {
      const appDir = getAppDirectory();
      if (appDir) {
        return path.join(appDir, 'data');
      }
    }
    
    // Fallback: lấy từ process.execPath
    try {
      if (typeof process !== 'undefined' && process.execPath) {
        const appDir = path.dirname(process.execPath);
        return path.join(appDir, 'data');
      }
    } catch (e) {
      console.error('Error getting app directory from process.execPath:', e);
    }
  }
  
  // Development: sử dụng __dirname
  return path.join(__dirname, 'data');
}

// Lazy evaluation để tránh lỗi khi module được load
let dataDir = null;
let soldierFile = null;

function getDataDirLazy() {
  if (!dataDir) {
    dataDir = getDataDir();
    soldierFile = path.join(dataDir, 'soldiers.json');
  }
  return dataDir;
}

function getSoldierFile() {
  if (!soldierFile) {
    getDataDirLazy();
  }
  return soldierFile;
}

function readSoldiers() {
  const file = getSoldierFile();
  if (!fs.existsSync(file)) {
    return [];
  }
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw);
}

function saveSoldiers(data) {
  const dir = getDataDirLazy();
  const file = getSoldierFile();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
