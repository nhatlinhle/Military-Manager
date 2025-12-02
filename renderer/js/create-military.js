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

  const params = new URLSearchParams(window.location.search);
  const unitId = params.get("unit-id");

  // Lấy thông tin đơn vị
  function readUnit() {
    return readData('unit.json');
  }
  const rows = readUnit();
  const unit = rows.find(u => u.id === unitId);
  if (unit) {
    $('#unit-name').text(unit.name);
  }

  // Khởi tạo datepicker cho tất cả các trường ngày tháng
  $('.datepicker').datepicker({
    format: "dd-mm-yyyy",
    language: "vi",
    autoclose: true,
    todayHighlight: true
  });

  // Xử lý preview ảnh
  $('#single-image-file').on('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        $('#preview-image').attr('src', e.target.result);
        $('#photo-preview').show();
      };
      reader.readAsDataURL(file);
    } else {
      $('#photo-preview').hide();
    }
  });

  // Xử lý nút quay lại
  $('#back-button').on('click', function() {
    window.location.href = 'list-military.html?unit-id=' + unitId;
  });

  // Xử lý submit form
  $('#create-military-form').on('submit', function(e) {
    e.preventDefault();
    
    // Lấy tất cả dữ liệu form
    const formData = {};
    $(this).find('input, select, textarea').each(function() {
      const name = $(this).attr('name');
      const value = $(this).val();
      if (name) {
        formData[name] = value;
      }
    });

    // Xử lý file ảnh nếu có
    const photoFile = $('#photo-upload')[0].files[0];
    if (photoFile) {
      // Có thể lưu file ảnh ở đây hoặc chuyển đổi sang base64
      const reader = new FileReader();
      reader.onload = function(e) {
        formData.photo = e.target.result;
        saveMilitaryData(formData);
      };
      reader.readAsDataURL(photoFile);
    } else {
      saveMilitaryData(formData);
    }
  });

  function saveMilitaryData(data) {
    // Thêm ID và unitId
    data.id = Date.now().toString();
    data.unitId = unitId;
    
    // Lưu dữ liệu
    saveData('military.json', data);
    
    // Hiển thị thông báo và chuyển trang
    alert('Lưu thông tin quân nhân thành công!');
    window.location.href = 'list-military.html?unit-id=' + unitId;
  }
});