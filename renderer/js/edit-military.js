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
  const militaryId = params.get("id");

  if (!militaryId) {
    alert('Không tìm thấy ID quân nhân!');
    window.location.href = 'list-military.html?unit-id=' + unitId;
    return;
  }

  // Lấy thông tin đơn vị
  function readUnit() {
    return readData('unit.json');
  }
  const rows = readUnit();
  const unit = rows.find(u => u.id === unitId);
  if (unit) {
    $('#unit-name').text(unit.name);
  }

  // Đọc dữ liệu quân nhân
  function readMilitary() {
    return readData('military.json');
  }

  const militaryList = readMilitary();
  const military = militaryList.find(m => m.id === militaryId);

  if (!military) {
    alert('Không tìm thấy thông tin quân nhân!');
    window.location.href = 'list-military.html?unit-id=' + unitId;
    return;
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
  function createRankRow(rankData = null) {
    const rowId = `rank-row-${rankRowCounter++}`;
    const rowHtml = `
      <div class="rank-row mb-2" data-row-id="${rowId}">
        <div class="row gap-2 mx-0 align-items-center">
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
    
    if (rankData) {
      $row.find('.rank-select').val(rankData.rank);
      $row.find('.rank-date').val(rankData.rank_date);
    }
    
    initDatepicker($row.find('.rank-date'));
  }

  // Hàm tạo dòng quân hàm
  function createRankNameRow(rankNameData = null) {
    const rowId = `rank-name-row-${rankNameRowCounter++}`;
    const rowHtml = `
      <div class="rank-name-row mb-2" data-row-id="${rowId}">
        <div class="row gap-2 mx-0 align-items-center">
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
    
    if (rankNameData) {
      $row.find('.rank-name-input').val(rankNameData.rank_name);
      $row.find('.rank-name-date').val(rankNameData.rank_name_date);
    }
    
    initDatepicker($row.find('.rank-name-date'));
  }

  // Hàm tạo dòng khen thưởng
  function createCommendationsRow(commendationData = null) {
    const rowId = `commendations-row-${commendationsRowCounter++}`;
    const rowHtml = `
      <div class="commendations-row mb-2" data-row-id="${rowId}">
        <div class="row gap-2 mx-0 align-items-center">
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
    
    if (commendationData) {
      $row.find('.commendations-input').val(commendationData.commendation);
      $row.find('.commendations-date').val(commendationData.commendation_date);
    }
    
    initDatepicker($row.find('.commendations-date'));
  }

  // Load dữ liệu vào form
  function loadMilitaryData() {
    // Load các trường đơn giản
    $('#full-name').val(military.full_name || '');
    $('#soldier-id').val(military.soldier_id || '');
    $('#date-of-birth').val(military.date_of_birth || '');
    $('#id-card-date').val(military.id_card_date || '');
    $('#position').val(military.position || '');
    $('#position-date').val(military.position_date || '');
    $('#cnqs').val(military.cnqs || '');
    $('#technical-level').val(military.technical_level || '');
    $('#enlistment-date').val(military.enlistment_date || '');
    $('#discharge-date').val(military.discharge_date || '');
    $('#re-enlistment-date').val(military.re_enlistment_date || '');
    $('#transfer-qncn-date').val(military.transfer_qncn_date || '');
    $('#transfer-cnv-date').val(military.transfer_cnv_date || '');
    $('#salary-group').val(military.salary_group || '');
    $('#salary-grade').val(military.salary_grade || '');
    $('#youth-union-date').val(military.youth_union_date || '');
    $('#party-date').val(military.party_date || '');
    $('#official-status').val(military.official_status || '');
    $('#family-background').val(military.family_background || '');
    $('#personal-background').val(military.personal_background || '');
    $('#ethnicity').val(military.ethnicity || '');
    $('#religion').val(military.religion || '');
    $('#education').val(military.education || '');
    $('#foreign-language').val(military.foreign_language || '');
    $('#health').val(military.health || '');
    $('#disability-rating').val(military.disability_rating || '');
    $('#discipline').val(military.discipline || '');
    $('#school-name').val(military.school_name || '');
    $('#education-level').val(military.education_level || '');
    $('#major').val(military.major || '');
    $('#education-duration').val(military.education_duration || '');
    $('#place-of-origin').val(military.place_of_origin || '');
    $('#place-of-birth').val(military.place_of_birth || '');
    $('#current-residence').val(military.current_residence || '');
    $('#emergency-contact').val(military.emergency_contact || '');
    $('#father-name').val(military.father_name || '');
    $('#mother-name').val(military.mother_name || '');
    $('#spouse-name').val(military.spouse_name || '');
    $('#children-count').val(military.children_count || '');
    $('#notes').val(military.notes || '');

    // Load avatar nếu có
    if (military.avatar) {
      const avatarPath = resolveImagePath(military.avatar);
      $('#preview-image').attr('src', avatarPath);
      $('#photo-preview').show();
    } else {
      $('#photo-preview').hide();
    }

    // Load ranks
    if (military.ranks && military.ranks.length > 0) {
      military.ranks.forEach(rank => {
        createRankRow(rank);
      });
    } else {
      createRankRow();
    }

    // Load rank_names
    if (military.rank_names && military.rank_names.length > 0) {
      military.rank_names.forEach(rankName => {
        createRankNameRow(rankName);
      });
    } else {
      createRankNameRow();
    }

    // Load commendations
    if (military.commendations && military.commendations.length > 0) {
      military.commendations.forEach(commendation => {
        createCommendationsRow(commendation);
      });
    } else {
      createCommendationsRow();
    }
  }

  // Load dữ liệu khi trang được tải
  loadMilitaryData();

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
      // Nếu không chọn file mới, giữ nguyên ảnh cũ
      if (military.avatar) {
        const avatarPath = resolveImagePath(military.avatar);
        $('#preview-image').attr('src', avatarPath);
        $('#photo-preview').show();
      } else {
        $('#photo-preview').hide();
      }
    }
  });

  // Xử lý nút quay lại
  $('.back-button').on('click', function() {
    window.location.href = 'list-military.html?unit-id=' + unitId;
  });

  // Xử lý submit form
  $('#edit-military-form').on('submit', async function(e) {
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

    // Giữ nguyên ID và unit_id
    data.id = militaryId;
    data.unit_id = unitId;

    // Xử lý avatar: nếu có file mới thì lưu, không thì giữ nguyên
    const photoFile = $('#single-image-file')[0].files[0];
    if (photoFile) {
      async function savePhoto() {
        const imageDir = path.join(getImagesDir(), 'avatar');
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
      await savePhoto();
    } else {
      // Giữ nguyên avatar cũ nếu không có file mới
      data.avatar = military.avatar || '';
    }

    await updateDataMilitary(data);

    window.location.href = 'list-military.html?unit-id=' + unitId + '&alert=update-success';
  });

  async function updateDataMilitary(data) {
    updateData('military.json', militaryId, data);
  }

  $('#back-button').on('click', function() {
    window.location.href = 'list-military.html?unit-id=' + unitId;
  });
});

