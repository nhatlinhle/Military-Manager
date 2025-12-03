const fs = require('fs');
const path = require('path');
const { app } = require('electron');

window.fs = fs;
window.path = path;
window.app = app;

// Expose helper function để lấy đường dẫn thư mục app (thư mục chứa file .exe khi portable)
window.getAppDirectory = function() {
  try {
    // Nếu app được đóng gói, lấy thư mục chứa file .exe
    if (app && app.isPackaged) {
      const execPath = process.execPath;
      const execDir = path.dirname(execPath);
      
      // Kiểm tra xem có phải portable app đang chạy từ thư mục tạm không
      // Portable app thường giải nén vào thư mục Temp với tên ngẫu nhiên
      const isTempDir = execDir.includes('Temp') && execDir.match(/[A-Z0-9]{8,}/);
      
      if (isTempDir) {
        // Nếu là portable app chạy từ thư mục tạm, cố gắng tìm thư mục gốc
        // Bằng cách kiểm tra xem có file portable nào đang mở không
        // Hoặc đơn giản hơn: lưu vào thư mục chứa file portable gốc
        // bằng cách tìm trong các ổ đĩa hoặc sử dụng cách khác
        
        // Tuy nhiên, cách đơn giản nhất là lưu vào thư mục hiện tại
        // Người dùng có thể copy file portable và chạy từ bất kỳ đâu
        // Nên tốt nhất là lưu vào thư mục chứa file .exe hiện tại
        return execDir;
      }
      
      // Trường hợp chạy từ win-unpacked hoặc thư mục cố định: lưu vào đó
      return execDir;
    }
  } catch (e) {
    console.error('Error getting app directory:', e);
  }
  return null;
};

// Expose helper function để lấy đường dẫn userData (không dùng cho portable)
window.getUserDataPath = function() {
  try {
    if (app && typeof app.getPath === 'function') {
      return app.getPath('userData');
    }
  } catch (e) {
    console.error('Error getting userData path:', e);
  }
  return null;
};

// Expose helper function để kiểm tra app có được đóng gói không
window.isAppPackaged = function() {
  try {
    if (app && typeof app.isPackaged !== 'undefined') {
      return app.isPackaged;
    }
  } catch (e) {
    // Fallback: kiểm tra __dirname
    if (typeof __dirname !== 'undefined') {
      return __dirname.includes('.asar');
    }
  }
  return false;
};