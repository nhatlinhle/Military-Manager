/**Generate function to read data from json file in data directory
 * @param {string} fileName - The name of the file to read
 * @returns {Object} - The data from the file
 */

/** Check file exists */
function checkFileExists(fileName) {
  const dataDir = path.join(__dirname, 'data');
  const filePath = path.join(dataDir, fileName);
  return fs.existsSync(filePath);
}

/** Read data from file */
function readData(fileName) {
  const dataDir = path.join(__dirname, 'data');
  const filePath = path.join(dataDir, fileName);
  if (!checkFileExists(fileName)) {
    return {};
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function saveData(fileName, data) {
  const dataDir = path.join(__dirname, 'data');
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
  const dataDir = path.join(__dirname, 'data');
  const data = readData(fileName);
  const newData = data.filter(item => item.id !== id);
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
}

function updateData(fileName, id, data) {
  const dataDir = path.join(__dirname, 'data');
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
