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
  const dataList = readData(fileName);
  const newData = dataList.map(item => item.id === id ? {...item, ...data} : item);
  saveData(fileName, newData);
}