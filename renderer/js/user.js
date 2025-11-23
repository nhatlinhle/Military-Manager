
$(document).ready(function() {
  function readUnit() {
    return readData('unit.json');
  }
  const params = new URLSearchParams(window.location.search);

  const unitId = params.get("unit-id");

  const rows = readUnit();

  const unit = rows.find(u => u.id === unitId);

  $('#unit-name').text(unit.name);
})