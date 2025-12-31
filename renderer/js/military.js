
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

  $('#create-new-button').on('click', function() {
    window.location.href = 'create-military.html?unit-id=' + unitId;
  });

  // Xử lý tìm kiếm
  $('#search-button').on('click', function() {
    filterMilitary();
  });

  // Tìm kiếm khi nhấn Enter trong ô tìm kiếm
  // $('#search-input').on('keypress', function(e) {
  //   if (e.which === 13) {
  //     e.preventDefault();
  //     filterMilitary();
  //   }
  // });

  // Tìm kiếm real-time khi thay đổi (optional - có thể bỏ nếu muốn chỉ tìm khi click button)
  // $('#search-input').on('input', function() {
  //   filterMilitary();
  // });

  // Lọc khi thay đổi năm hoặc cấp bậc
  // $('#datepicker').on('change', function() {
  //   filterMilitary();
  // });

  // $('#rank').on('change', function() {
  //   filterMilitary();
  // });

  // Xử lý nút làm mới (reset bộ lọc)
  $('#reset-search-button').on('click', function() {
    $('#search-input').val('');
    $('#datepicker').val('');
    $('#rank').val('');
    loadMilitaryData();
  });

  if (params.get("alert") == "create-success") {
    $("#alert-create-success").removeClass("d-none");
    params.delete("alert");

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }

  if (params.get("alert") == "delete-success") {
    $("#alert-delete-success").removeClass("d-none");
    params.delete("alert");

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }

  if (params.get("alert") == "update-success") {
    $("#alert-update-success").removeClass("d-none");
    params.delete("alert");

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }

  $('.close-alert-button').on('click', function() {
    $("#alert-create-success").addClass("d-none");
    $("#alert-delete-success").addClass("d-none");
    $("#alert-update-success").addClass("d-none");
  });

  function readMilitary() {
    return readData('military.json');
  }

  // Lưu toàn bộ dữ liệu quân nhân của đơn vị
  let allMilitaryRows = [];
  
  function loadMilitaryData() {
    const military = readMilitary();
    allMilitaryRows = military.filter(m => m.unit_id == unitId);
    renderTable(allMilitaryRows);
  }

  // Hàm render bảng
  function renderTable(militaryRows) {
    const tbody = $('#users-table tbody');
    tbody.empty();
    
    // Hiển thị số lượng kết quả
    $('#result-count').text(`(${militaryRows.length} quân nhân)`);
    
    if (militaryRows.length === 0) {
      tbody.append(`
        <tr>
          <td colspan="7" class="text-center">Không tìm thấy dữ liệu</td>
        </tr>
      `);
      return;
    }

    militaryRows.forEach((row, index) => {
      tbody.append(`
        <tr>
          <td>${index + 1}</td>
          <td>${row.soldier_id || ''}</td>
          <td>${row.full_name || ''}</td>
          <td>${row.date_of_birth || ''}</td>
          <td>${row.enlistment_date || ''}</td>
          <td>${row.position || ''}</td>
          <td>
            <button type="button" class="btn btn-primary btn-sm edit-military-button" data-id="${row.id}">
              <i class="fa fa-edit"></i>
            </button>
            <button type="button" class="btn btn-danger btn-sm delete-military-button" data-bs-toggle="modal" data-bs-target="#delete-military-modal" data-id="${row.id}">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      `);
    });
  }

  // Hàm lọc dữ liệu
  function filterMilitary() {
    const searchText = $('#search-input').val().toLowerCase().trim();
    const yearEntry = $('#datepicker').val();
    const rankValue = $('#rank').val();

    let filteredRows = allMilitaryRows.filter(row => {
      // Lọc theo tên hoặc mã quân nhân
      if (searchText) {
        const fullName = (row.full_name || '').toLowerCase();
        const soldierId = (row.soldier_id || '').toLowerCase();
        if (!fullName.includes(searchText) && !soldierId.includes(searchText)) {
          return false;
        }
      }

      // Lọc theo năm nhập ngũ
      if (yearEntry) {
        const enlistmentDate = row.enlistment_date || '';
        // enlistment_date format: dd-mm-yyyy
        const year = enlistmentDate.split('-')[2];
        if (year !== yearEntry) {
          return false;
        }
      }

      // Lọc theo cấp bậc
      if (rankValue) {
        const ranks = row.ranks || [];
        // Kiểm tra xem có cấp bậc nào khớp không (lấy cấp bậc cao nhất)
        const hasRank = ranks.some(rank => rank.rank === rankValue);
        if (!hasRank) {
          return false;
        }
      }

      return true;
    });

    renderTable(filteredRows);
  }

  // Load dữ liệu ban đầu
  loadMilitaryData();

  // Xử lý nút edit
  $(document).on('click', '.edit-military-button', function() {
    const id = $(this).data('id');
    window.location.href = 'edit-military.html?unit-id=' + unitId + '&id=' + id;
  });

  $('#delete-military-modal').on('show.bs.modal', function(event) {
    const button = $(event.relatedTarget);
    const id = button.data('id');
    $('#delete-military-id').val(id);
  });

  $('#delete-military-form').on('submit', function(e) {
    e.preventDefault();
    const id = $('#delete-military-id').val();
    console.log(id)
    deleteData('military.json', id);
    window.location.href = 'list-military.html?unit-id=' + unitId + '&alert=delete-success';
  });

  // Xử lý xuất file JSON
  $('#export-json-button').on('click', function() {
    try {
      // Đọc dữ liệu từ military.json
      const militaryData = readMilitary();
      
      // Chuyển đổi thành JSON string với format đẹp
      const jsonString = JSON.stringify(militaryData, null, 2);
      
      // Tạo blob từ JSON string
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Tạo URL từ blob
      const url = URL.createObjectURL(blob);
      
      // Tạo thẻ a để download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'military.json';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Xuất file JSON thành công!');
    } catch (error) {
      console.error('Lỗi khi xuất file JSON:', error);
      alert('Có lỗi xảy ra khi xuất file JSON: ' + error.message);
    }
  });

  // Xử lý nhập file JSON
  $('#import-json-button').on('click', function() {
    // Trigger click vào input file ẩn
    $('#import-json-file').click();
  });

  $('#import-json-file').on('change', function(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    // Kiểm tra định dạng file
    if (!file.name.endsWith('.json')) {
      alert('Vui lòng chọn file JSON!');
      $(this).val('');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        // Parse JSON từ file
        const importedData = JSON.parse(e.target.result);
        
        // Đảm bảo importedData là mảng
        let importedArray = [];
        if (Array.isArray(importedData)) {
          importedArray = importedData;
        } else if (typeof importedData === 'object' && importedData !== null) {
          importedArray = [importedData];
        } else {
          throw new Error('Dữ liệu không hợp lệ');
        }

        // Đọc dữ liệu hiện tại
        const currentData = readMilitary();
        
        // Lấy danh sách soldier_id hiện có
        const existingSoldierIds = new Set(
          currentData.map(item => item.soldier_id).filter(id => id)
        );
        
        // Lọc và merge dữ liệu mới (không trùng soldier_id)
        let addedCount = 0;
        let skippedCount = 0;
        const newData = [...currentData];
        
        importedArray.forEach(item => {
          // Thay thế unit_id bằng unit_id từ URL parameter
          item.unit_id = unitId;
          
          // Kiểm tra soldier_id
          if (!item.soldier_id) {
            skippedCount++;
            return;
          }
          
          // Kiểm tra trùng soldier_id
          if (existingSoldierIds.has(item.soldier_id)) {
            skippedCount++;
            return;
          }
          
          // Thêm vào danh sách
          newData.push(item);
          existingSoldierIds.add(item.soldier_id);
          addedCount++;
        });
        
        // Lưu dữ liệu mới
        const dataDir = getDataDir();
        const filePath = window.path.join(dataDir, 'military.json');
        window.fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
        
        // Thông báo kết quả
        let message = `Nhập file JSON thành công!\n`;
        message += `- Đã thêm: ${addedCount} quân nhân\n`;
        if (skippedCount > 0) {
          message += `- Đã bỏ qua: ${skippedCount} quân nhân (trùng soldier_id hoặc thiếu soldier_id)`;
        }
        alert(message);
        
        // Reload dữ liệu
        loadMilitaryData();
        
        // Reset input file
        $('#import-json-file').val('');
      } catch (error) {
        console.error('Lỗi khi nhập file JSON:', error);
        alert('Có lỗi xảy ra khi nhập file JSON: ' + error.message);
        $('#import-json-file').val('');
      }
    };
    
    reader.onerror = function() {
      alert('Có lỗi xảy ra khi đọc file!');
      $('#import-json-file').val('');
    };
    
    reader.readAsText(file);
  });
})