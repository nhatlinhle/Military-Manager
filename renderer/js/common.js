/**Generate function to read data from json file in data directory
 * @param {string} fileName - The name of the file to read
 * @returns {Object} - The data from the file
 */

// Lấy đường dẫn thư mục data - sử dụng thư mục app khi đóng gói, __dirname khi development
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

// Lấy đường dẫn thư mục images - sử dụng thư mục app khi đóng gói, __dirname khi development
function getImagesDir() {
  // Kiểm tra nếu app được đóng gói
  const isPackaged = typeof __dirname !== 'undefined' && __dirname.includes('.asar') ||
                     (typeof app !== 'undefined' && app && app.isPackaged);
  
  if (isPackaged) {
    // Khi đóng gói (portable), lưu vào thư mục chứa file .exe
    if (typeof getAppDirectory === 'function') {
      const appDir = getAppDirectory();
      if (appDir) {
        return path.join(appDir, 'images');
      }
    }
    
    // Fallback: lấy từ process.execPath
    try {
      if (typeof process !== 'undefined' && process.execPath) {
        const appDir = path.dirname(process.execPath);
        return path.join(appDir, 'images');
      }
    } catch (e) {
      console.error('Error getting app directory from process.execPath:', e);
    }
  }
  
  // Development: sử dụng __dirname
  return path.join(__dirname, 'images');
}

// Convert đường dẫn tương đối của image sang đường dẫn tuyệt đối để hiển thị
function resolveImagePath(relativePath) {
  if (!relativePath) return '';
  // Nếu đã là đường dẫn tuyệt đối hoặc URL, trả về nguyên
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://') || relativePath.startsWith('file://')) {
    return relativePath;
  }
  // Nếu là đường dẫn tương đối (bắt đầu bằng ./images/)
  if (relativePath.startsWith('./images/')) {
    const imagesDir = getImagesDir();
    // Loại bỏ './images/' để lấy phần còn lại (có thể là 'avatar/filename.jpg' hoặc 'filename.jpg')
    const imagePath = relativePath.replace('./images/', '');
    const absolutePath = path.join(imagesDir, imagePath);
    // Convert sang file:// URL để trình duyệt có thể hiển thị
    // Windows cần format: file:///C:/path/to/file
    return 'file:///' + absolutePath.replace(/\\/g, '/');
  }
  // Nếu là đường dẫn tương đối khác, thử xử lý tương tự
  if (relativePath.startsWith('./')) {
    const imagesDir = getImagesDir();
    const absolutePath = path.join(imagesDir, relativePath.replace('./', ''));
    return 'file:///' + absolutePath.replace(/\\/g, '/');
  }
  return relativePath;
}

/** Check file exists */
function checkFileExists(fileName) {
  const dataDir = getDataDir();
  const filePath = path.join(dataDir, fileName);
  return fs.existsSync(filePath);
}

/** Read data from file */
function readData(fileName) {
  const dataDir = getDataDir();
  const filePath = path.join(dataDir, fileName);
  if (!checkFileExists(fileName)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    // Đảm bảo luôn trả về mảng
    if (Array.isArray(data)) {
      return data;
    }
    // Nếu là object, chuyển thành mảng
    if (typeof data === 'object' && data !== null) {
      return [data];
    }
    return [];
  } catch (err) {
    console.error('Error reading JSON file:', err);
    return [];
  }
}

function saveData(fileName, data) {
  const dataDir = getDataDir();
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, fileName);

  let currentData = [];

  // Nếu file đã tồn tại → đọc dữ liệu cũ
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      currentData = JSON.parse(raw);
      if (!Array.isArray(currentData)) {
        currentData = [currentData]; // Nếu dữ liệu cũ là object, chuyển thành array
      }
    } catch (err) {
      console.error('Error reading existing JSON:', err);
      currentData = [];
    }
  }

  // Thêm object mới
  currentData.push(data);

  // Ghi lại
  fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf-8');
}

function deleteData(fileName, id) {
  const dataDir = getDataDir();
  const data = readData(fileName);
  const newData = data.filter(item => item.id !== id);
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
}

function updateData(fileName, id, data) {
  const dataDir = getDataDir();
  const dataList = readData(fileName);
  const newData = dataList.map(item => item.id === id ? {...item, ...data} : item);
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
}

function showError(field, message) {
    const $err = $(`#${field}-error`);
    const $inputErr = $(`.${field}-input-error`);
    $err.text(message).addClass("color-error-validate");
    $inputErr.addClass("is-invalid");
  }

  function clearError(field) {
    const $err = $(`#${field}-error`);
    const $inputErr = $(`.${field}-input-error`);
    $err.text("").removeClass("color-error-validate");
    $inputErr.removeClass("is-invalid");
  }

  function validateField(field, value, ruleSet) {
    clearError(field);

    if (ruleSet.required && !value) {
      showError(field, ruleSet.required);
      return false;
    }
    if (ruleSet.min && value.length < ruleSet.min.value) {
      showError(field, ruleSet.min.message);
      return false;
    }
    if (ruleSet.max && value.length > ruleSet.max.value) {
      showError(field, ruleSet.max.message);
      return false;
    }
    return true;
  }

document.querySelectorAll(".toggle-password").forEach(function (eyeIcon) {
    eyeIcon.addEventListener("click", function () {

        // Tìm input trong cùng input-group
        const input = this.closest(".input-group").querySelector("input");

        if (input.type === "password") {
            input.type = "text";
            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");
        }
    });
});


