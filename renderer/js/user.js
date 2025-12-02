
$(document).ready(function() {
  // Định nghĩa locale tiếng Việt cho datepicker
  $.fn.datepicker.dates['vi'] = {
    days: ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"],
    daysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    daysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    monthsShort: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    today: "Hôm nay",
    clear: "Xóa",
    titleFormat: "MM yyyy"
  };

  function readUnit() {
    return readData('unit.json');
  }
  const params = new URLSearchParams(window.location.search);

  const unitId = params.get("unit-id");

  const rows = readUnit();

  const unit = rows.find(u => u.id === unitId);

  $('#unit-name').text(unit.name);

  $("#datepicker").datepicker({
    format: "yyyy",
    viewMode: "years", 
    minViewMode: "years",
    language: "vi"
  });

  $("#month-receive-rank").datepicker({
    format: "mm-yyyy",
    viewMode: "months", 
    minViewMode: "months",
    language: "vi"
  });
})