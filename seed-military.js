const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Dữ liệu mẫu
const ho = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const tenDem = ['Văn', 'Thị', 'Đức', 'Minh', 'Quang', 'Hữu', 'Công', 'Đình', 'Xuân', 'Thanh', 'Hoàng', 'Nhật', 'Thành', 'Tuấn', 'Hùng'];
const ten = ['Anh', 'Bình', 'Cường', 'Dũng', 'Đức', 'Giang', 'Hải', 'Hùng', 'Khoa', 'Linh', 'Long', 'Minh', 'Nam', 'Phong', 'Quang', 'Sơn', 'Tài', 'Thành', 'Tuấn', 'Việt', 'Vinh', 'Xuân', 'Yên', 'Hoa', 'Lan', 'Mai', 'Nga', 'Phương', 'Thảo', 'Trang', 'Uyên', 'Vy'];

const positions = ['Hậu cần', 'Quân y', 'Thông tin', 'Kỹ thuật', 'Tác chiến', 'Chính trị', 'Hành chính', 'Tài chính', 'Vận tải', 'Công binh'];
const technicalLevels = ['Kỹ sư', 'Cử nhân', 'Thạc sĩ', 'Tiến sĩ', 'Trung cấp', 'Cao đẳng'];
const ethnicities = ['Kinh', 'Tày', 'Thái', 'Mường', 'Khmer', 'Hoa', 'Nùng', 'Hmong', 'Dao', 'Gia Rai'];
const provinces = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu', 'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước', 'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'];
const schools = ['THPT Lê Trực', 'THPT Nguyễn Du', 'THPT Trần Phú', 'THPT Lê Lợi', 'THPT Nguyễn Huệ', 'THPT Hoàng Diệu', 'THPT Phan Châu Trinh', 'THPT Quang Trung', 'THPT Lý Thường Kiệt', 'THPT Trần Hưng Đạo'];
const rankNames = ['Úy', 'Tá', 'Tướng', 'Đại úy', 'Thiếu úy', 'Trung úy', 'Thượng úy'];
const commendations = ['Huân chương Chiến công hạng Ba', 'Huân chương Chiến công hạng Nhì', 'Huân chương Chiến công hạng Nhất', 'Bằng khen', 'Giấy khen', 'Danh hiệu Chiến sĩ thi đua', 'Danh hiệu Chiến sĩ quyết thắng'];

// Hàm random từ mảng
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Hàm random số trong khoảng
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Hàm format ngày dd-mm-yyyy
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Hàm tạo ngày ngẫu nhiên trong khoảng
function randomDate(start, end) {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

// Hàm tạo ngày sau ngày cho trước
function dateAfter(date, minDays, maxDays) {
  const days = randomInt(minDays, maxDays);
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

// Hàm generate tên đầy đủ
function generateFullName() {
  const hoName = randomItem(ho);
  const tenDemName = Math.random() > 0.3 ? randomItem(tenDem) + ' ' : '';
  const tenName = randomItem(ten);
  return `${hoName} ${tenDemName}${tenName}`.trim();
}

// Hàm generate số hiệu quân nhân
function generateSoldierId(index) {
  const prefix = 'SL';
  const number = String(index + 1).padStart(4, '0');
  return `${prefix}${number}`;
}

// Hàm generate ranks
function generateRanks(enlistmentDate) {
  const ranks = [];
  const numRanks = randomInt(1, 3);
  let currentDate = new Date(enlistmentDate);
  
  for (let i = 0; i < numRanks; i++) {
    const rank = randomInt(1, 12); // Cấp bậc từ 1-12 (Binh nhất đến Đại tá)
    currentDate = dateAfter(currentDate, 180, 730); // 6 tháng đến 2 năm giữa các cấp bậc
    ranks.push({
      rank: String(rank),
      rank_date: formatDate(currentDate)
    });
  }
  
  return ranks;
}

// Hàm generate rank_names
function generateRankNames(enlistmentDate) {
  const rankNamesList = [];
  const numRankNames = randomInt(1, 2);
  let currentDate = new Date(enlistmentDate);
  
  for (let i = 0; i < numRankNames; i++) {
    const rankName = randomItem(rankNames);
    currentDate = dateAfter(currentDate, 90, 365);
    rankNamesList.push({
      rank_name: rankName,
      rank_name_date: formatDate(currentDate)
    });
  }
  
  return rankNamesList;
}

// Hàm generate commendations
function generateCommendations(enlistmentDate) {
  const commendationsList = [];
  const numCommendations = Math.random() > 0.7 ? randomInt(1, 2) : 0; // 30% có khen thưởng
  let currentDate = new Date(enlistmentDate);
  
  for (let i = 0; i < numCommendations; i++) {
    const commendation = randomItem(commendations);
    currentDate = dateAfter(currentDate, 180, 1095); // 6 tháng đến 3 năm
    commendationsList.push({
      commendation: commendation,
      commendation_date: formatDate(currentDate)
    });
  }
  
  return commendationsList;
}

// Hàm generate một record
function generateRecord(index, unitIds) {
  const unitId = randomItem(unitIds);
  
  // Ngày sinh: từ 1980 đến 2005
  const birthDate = randomDate(new Date(1980, 0, 1), new Date(2005, 11, 31));
  
  // Ngày nhập ngũ: từ 2015 đến 2024, sau ngày sinh ít nhất 18 năm
  const minEnlistmentDate = new Date(Math.max(birthDate.getTime(), new Date(2015, 0, 1).getTime()));
  minEnlistmentDate.setFullYear(minEnlistmentDate.getFullYear() + 18);
  const enlistmentDate = randomDate(minEnlistmentDate, new Date(2024, 11, 31));
  
  // Các ngày khác
  const idCardDate = dateAfter(enlistmentDate, 30, 180);
  const positionDate = dateAfter(enlistmentDate, 60, 365);
  const transferQncnDate = Math.random() > 0.5 ? dateAfter(enlistmentDate, 180, 730) : null;
  const transferCnvDate = transferQncnDate && Math.random() > 0.5 ? dateAfter(transferQncnDate, 30, 180) : null;
  
  // Ngày vào Đoàn: trước nhập ngũ
  const youthUnionDate = randomDate(new Date(birthDate.getFullYear() + 14, 0, 1), enlistmentDate);
  
  // Ngày vào Đảng: sau nhập ngũ, 30% có
  const partyDate = Math.random() > 0.7 ? dateAfter(enlistmentDate, 365, 1825) : null;
  
  const record = {
    full_name: generateFullName(),
    soldier_id: generateSoldierId(index),
    date_of_birth: formatDate(birthDate),
    id_card_date: formatDate(idCardDate),
    position: randomItem(positions),
    position_date: formatDate(positionDate),
    cnqs: Math.random() > 0.8 ? `CNQS${randomInt(1000, 9999)}` : '',
    technical_level: randomItem(technicalLevels),
    enlistment_date: formatDate(enlistmentDate),
    discharge_date: Math.random() > 0.9 ? formatDate(dateAfter(enlistmentDate, 1095, 2555)) : '',
    re_enlistment_date: '',
    transfer_qncn_date: transferQncnDate ? formatDate(transferQncnDate) : '',
    transfer_cnv_date: transferCnvDate ? formatDate(transferCnvDate) : '',
    salary_group: `${randomInt(5, 20)},000,000`,
    salary_grade: Math.random() > 0.5 ? String(randomInt(1, 10)) : '',
    youth_union_date: formatDate(youthUnionDate),
    party_date: partyDate ? formatDate(partyDate) : '',
    official_status: Math.random() > 0.3 ? 'yes' : 'no',
    family_background: Math.random() > 0.7 ? randomItem(['Công nhân', 'Nông dân', 'Trí thức', 'Tiểu thương', 'Cán bộ']) : '',
    personal_background: Math.random() > 0.7 ? randomItem(['Học sinh', 'Sinh viên', 'Công nhân', 'Nông dân']) : '',
    ethnicity: randomItem(ethnicities),
    religion: Math.random() > 0.8 ? randomItem(['Phật giáo', 'Công giáo', 'Cao Đài', 'Hòa Hảo']) : '',
    education: `${randomInt(9, 12)}/12`,
    foreign_language: Math.random() > 0.5 ? randomItem(['Tiếng Việt, Tiếng Anh', 'Tiếng Việt, Tiếng Trung', 'Tiếng Việt, Tiếng Nga', 'Tiếng Việt']) : 'Tiếng Việt',
    health: randomItem(['Tốt', 'Khá', 'Bình thường']),
    disability_rating: Math.random() > 0.95 ? randomItem(['Hạng 1', 'Hạng 2', 'Hạng 3']) : '',
    discipline: Math.random() > 0.9 ? randomItem(['Cảnh cáo', 'Khiển trách']) : '',
    school_name: randomItem(schools),
    education_level: String(randomInt(9, 12)),
    major: Math.random() > 0.7 ? randomItem(['Công nghệ thông tin', 'Điện tử', 'Cơ khí', 'Xây dựng', 'Kinh tế']) : '',
    education_duration: String(randomInt(2010, 2020)),
    place_of_origin: randomItem(provinces),
    place_of_birth: randomItem(provinces),
    current_residence: randomItem(provinces),
    emergency_contact: Math.random() > 0.5 ? `Liên hệ: ${generateFullName()}, ĐT: 0${randomInt(100000000, 999999999)}` : '',
    father_name: generateFullName(),
    mother_name: generateFullName(),
    spouse_name: Math.random() > 0.6 ? generateFullName() : '',
    children_count: Math.random() > 0.7 ? String(randomInt(1, 3)) : '',
    notes: Math.random() > 0.8 ? randomItem(['Xuất sắc trong công tác', 'Có thành tích trong huấn luyện', 'Nhiệt tình trong mọi công việc']) : '',
    ranks: generateRanks(enlistmentDate),
    rank_names: generateRankNames(enlistmentDate),
    id: uuidv4(),
    unit_id: unitId
  };
  
  // Thêm commendations nếu có
  const commendationsList = generateCommendations(enlistmentDate);
  if (commendationsList.length > 0) {
    record.commendations = commendationsList;
  }
  
  return record;
}

// Main function
function main() {
  // Đọc unit.json để lấy danh sách unit_id
  const unitFilePath = path.join(__dirname, 'renderer', 'data', 'unit.json');
  let unitIds = [];
  
  try {
    const unitData = JSON.parse(fs.readFileSync(unitFilePath, 'utf8'));
    unitIds = unitData.map(unit => unit.id);
  } catch (error) {
    console.error('Error reading unit.json:', error);
    // Fallback unit IDs nếu không đọc được
    unitIds = ['3410460b-7d88-4612-8ed4-db4545dbf900', '4431df7f-ad2a-49dd-8c93-c8ff21c1ff95'];
  }
  
  if (unitIds.length === 0) {
    console.error('No unit IDs found!');
    return;
  }
  
  // Generate 200 records
  const records = [];
  for (let i = 0; i < 200; i++) {
    records.push(generateRecord(i, unitIds));
  }
  
  // Ghi vào file
  const outputPath = path.join(__dirname, 'renderer', 'data', 'military.json');
  fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf8');
  
  console.log(`✅ Đã tạo thành công ${records.length} records vào file ${outputPath}`);
  console.log(`📊 Phân bổ theo đơn vị:`);
  
  // Thống kê
  const stats = {};
  records.forEach(record => {
    stats[record.unit_id] = (stats[record.unit_id] || 0) + 1;
  });
  
  Object.keys(stats).forEach(unitId => {
    const unit = JSON.parse(fs.readFileSync(unitFilePath, 'utf8')).find(u => u.id === unitId);
    const unitName = unit ? unit.name : unitId;
    console.log(`   - ${unitName}: ${stats[unitId]} quân nhân`);
  });
}

main();

