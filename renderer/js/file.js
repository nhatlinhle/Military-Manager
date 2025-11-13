const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');
const soldierFile = path.join(dataDir, 'soldiers.json');

function readSoldiers() {
  const raw = fs.readFileSync(soldierFile, 'utf8');
  return JSON.parse(raw);
}

function saveSoldiers(data) {
  fs.writeFileSync(soldierFile, JSON.stringify(data, null, 2));
}
