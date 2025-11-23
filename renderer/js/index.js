
function readUnit() {
  return readData('unit.json');
}

$(document).ready(function() {
  const rows = readUnit();

  rows.forEach(row => {
    $('#unit-list').append(`
        <div style="background: #ffffff1f; border-radius: 10px;">
            <a href="javascript:void(0)" class="d-flex flex-column align-items-center hover-zoom p-2 unit-item" data-id="${row.id}">
                <img src="${row.logo}" width="90" height="90" alt="">
                <span class="text-info" style="font-size: 20px;">${row.name}</span>
            </a>
        </div>
    `);
  });

  $(".unit-item").on("click", function() {
    const unitId = $(this).data("id");
    localStorage.setItem("unit-id", unitId) 
    window.location.href = 'list-user.html?unit-id=' + unitId;
  })
})