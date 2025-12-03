
function readUnit() {
  return readData('unit.json');
}

$(document).ready(function() {
  const rows = readUnit();

  rows.forEach(row => {
    const imagePath = resolveImagePath(row.logo);
    $('#unit-list').append(`
        <div class="p-4" style="background: #ffffff1f;">
            <a href="javascript:void(0)" class="d-flex flex-column align-items-center hover-zoom p-2 unit-item" data-id="${row.id}">
                <img src="${imagePath}" width="90" height="90" alt="">
                <span class="text-info mt-2" style="font-size: 20px;">${row.name}</span>
            </a>
        </div>
    `);
  });

  $(".unit-item").on("click", function() {
    const unitId = $(this).data("id");
    localStorage.setItem("unit-id", unitId) 
    window.location.href = 'list-military.html?unit-id=' + unitId;
  })
})