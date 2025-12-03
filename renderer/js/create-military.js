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

  // Hàm khởi tạo datepicker cho một element
  function initDatepicker(element) {
    $(element).datepicker({
      format: "dd-mm-yyyy",
      language: "vi",
      autoclose: true,
      todayHighlight: true
    });
  }

  // Counter để tạo ID duy nhất cho mỗi dòng
  let rankRowCounter = 0;
  let rankNameRowCounter = 0;
  let commendationsRowCounter = 0;

  // Hàm tạo dòng cấp bậc
  function createRankRow() {
    const rowId = `rank-row-${rankRowCounter++}`;
    const rowHtml = `
      <div class="rank-row mb-2" data-row-id="${rowId}">
        <div class="row gap-2 align-items-center">
          <div class="col-5 px-0">
            <select class="form-control px-2 rank-select" name="rank[]">
              <option value="">Chọn cấp bậc</option>
              <option value="1">Binh nhất</option>
              <option value="2">Binh nhì</option>
              <option value="3">Hạ sĩ</option>
              <option value="4">Trung sĩ</option>
              <option value="5">Thượng sĩ</option>
              <option value="6">Thiếu úy</option>
              <option value="7">Trung úy</option>
              <option value="8">Thượng úy</option>
              <option value="9">Đại úy</option>
              <option value="10">Thiếu tá</option>
              <option value="11">Trung tá</option>
              <option value="12">Thượng tá</option>
              <option value="13">Đại tá</option>
              <option value="14">Thiếu tướng</option>
              <option value="15">Trung tướng</option>
              <option value="16">Thượng tướng</option>
              <option value="17">Đại tướng</option>
            </select>
          </div>
          <div class="col-5 px-0">
            <input type="text" class="form-control datepicker px-2 rank-date" name="rank_date[]" placeholder="Chọn ngày nhận cấp bậc">
          </div>
          <div class="col-1 px-0">
            <button type="button" class="btn btn-sm btn-danger remove-row">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    const $row = $(rowHtml);
    $('#rank-rows-container').append($row);
    initDatepicker($row.find('.rank-date'));
  }

  // Hàm tạo dòng quân hàm
  function createRankNameRow() {
    const rowId = `rank-name-row-${rankNameRowCounter++}`;
    const rowHtml = `
      <div class="rank-name-row mb-2" data-row-id="${rowId}">
        <div class="row gap-2 align-items-center">
          <div class="col-5 px-0">
            <input type="text" class="form-control rank-name-input" name="rank_name[]" placeholder="Nhập quân hàm">
          </div>
          <div class="col-5 px-0">
            <input type="text" class="form-control datepicker px-2 rank-name-date" name="rank_name_date[]" placeholder="Chọn ngày">
          </div>
          <div class="col-1 px-0">
            <button type="button" class="btn btn-sm btn-danger remove-row">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    const $row = $(rowHtml);
    $('#rank-name-rows-container').append($row);
    initDatepicker($row.find('.rank-name-date'));
  }

  // Hàm tạo dòng khen thưởng
  function createCommendationsRow() {
    const rowId = `commendations-row-${commendationsRowCounter++}`;
    const rowHtml = `
      <div class="commendations-row mb-2" data-row-id="${rowId}">
        <div class="row gap-2 align-items-center">
          <div class="col-5 px-0">
            <input type="text" class="form-control commendations-input" name="commendations[]" placeholder="Nhập thông tin khen thưởng">
          </div>
          <div class="col-5 px-0">
            <input type="text" class="form-control datepicker px-2 commendations-date" name="commendations_date[]" placeholder="Chọn ngày">
          </div>
          <div class="col-1 px-0">
            <button type="button" class="btn btn-sm btn-danger remove-row">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    const $row = $(rowHtml);
    $('#commendations-rows-container').append($row);
    initDatepicker($row.find('.commendations-date'));
  }

  // Xử lý nút thêm dòng
  $('#add-rank-row').on('click', function() {
    createRankRow();
  });

  $('#add-rank-name-row').on('click', function() {
    createRankNameRow();
  });

  $('#add-commendations-row').on('click', function() {
    createCommendationsRow();
  });

  // Xử lý nút xóa dòng (sử dụng event delegation)
  $(document).on('click', '.remove-row', function() {
    $(this).closest('.rank-row, .rank-name-row, .commendations-row').remove();
  });

  // Khởi tạo một dòng mặc định cho mỗi trường
  createRankRow();
  createRankNameRow();
  createCommendationsRow();

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
  $('.back-button').on('click', function() {
    window.location.href = 'list-military.html?unit-id=' + unitId;
  });

  // Xử lý submit form
  $('#create-military-form').on('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {};
    
    // Xử lý các trường thông thường
    for (let [key, value] of formData.entries()) {
      if (key !== 'avatar' && !key.endsWith('[]')) {
        data[key] = value;
      }
    }

    // Xử lý các trường dạng mảng: cấp bậc
    const ranks = [];
    $('.rank-row').each(function() {
      const rank = $(this).find('.rank-select').val();
      const rankDate = $(this).find('.rank-date').val();
      if (rank || rankDate) {
        ranks.push({
          rank: rank || '',
          rank_date: rankDate || ''
        });
      }
    });
    if (ranks.length > 0) {
      data.ranks = ranks;
    }

    // Xử lý các trường dạng mảng: quân hàm
    const rankNames = [];
    $('.rank-name-row').each(function() {
      const rankName = $(this).find('.rank-name-input').val();
      const rankNameDate = $(this).find('.rank-name-date').val();
      if (rankName || rankNameDate) {
        rankNames.push({
          rank_name: rankName || '',
          rank_name_date: rankNameDate || ''
        });
      }
    });
    if (rankNames.length > 0) {
      data.rank_names = rankNames;
    }

    // Xử lý các trường dạng mảng: khen thưởng
    const commendations = [];
    $('.commendations-row').each(function() {
      const commendation = $(this).find('.commendations-input').val();
      const commendationDate = $(this).find('.commendations-date').val();
      if (commendation || commendationDate) {
        commendations.push({
          commendation: commendation || '',
          commendation_date: commendationDate || ''
        });
      }
    });
    if (commendations.length > 0) {
      data.commendations = commendations;
    }

    data.id = uuidv4();
    data.unit_id = unitId;

    const photoFile = $('#single-image-file')[0].files[0];
    if (photoFile) {
      async function savePhoto() {
        const imageDir = path.join(__dirname, 'images', 'avatar');
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        const imageName = `${uuidv4()}-${photoFile.name}`;
        const imagePathAbs = path.join(imageDir, imageName);

        const arrayBuffer = await photoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(imagePathAbs, buffer);
        data.avatar = `./images/avatar/${imageName}`;
      }
      savePhoto();
    }

    await saveDataMilitary(data);

    window.location.href = 'list-military.html?unit-id=' + unitId + '&alert=create-success';
  });

  async function saveDataMilitary(data) {
    saveData('military.json', data);
  }

  $('#back-button').on('click', function() {
    window.location.href = 'list-military.html?unit-id=' + unitId;
  });
});