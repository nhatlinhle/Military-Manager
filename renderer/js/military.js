
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

  $('#close-alert-button').on('click', function() {
    $("#alert-create-success").addClass("d-none");
    $("#alert-delete-success").addClass("d-none");
  });

  function readMilitary() {
    return readData('military.json');
  }

  const military = readMilitary();

  const militaryRows = military.filter(m => m.unit_id == unitId);

  militaryRows.forEach((row, index) => {
    $('#users-table tbody').append(`
      <tr>
        <td>${index + 1}</td>
        <td>${row.soldier_id}</td>
        <td>${row.full_name}</td>
        <td>${row.date_of_birth}</td>
        <td>${row.enlistment_date}</td>
        <td>${row.position}</td>
        <td>
          <button type="button" class="btn btn-primary btn-sm edit-military-button" data-bs-toggle="modal" data-bs-target="#edit-military-modal" data-id="${row.id}">
            <i class="fa fa-edit"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm delete-military-button" data-bs-toggle="modal" data-bs-target="#delete-military-modal" data-id="${row.id}">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `);
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
})