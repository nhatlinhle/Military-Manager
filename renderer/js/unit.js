async function saveDataUnit(formData) {
  const imageDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  const image = formData.get('logo');

  // Convert file → ArrayBuffer → Buffer
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const imageName = `${uuidv4()}-${image.name}`;
  const imagePathAbs = path.join(imageDir, imageName);

  // Save image file
  fs.writeFileSync(imagePathAbs, buffer);

  // Save JSON với đường dẫn tương đối
  const imagePathRel = `./images/${imageName}`;
  saveData('unit.json', {
    id: uuidv4(),
    name: formData.get('name'),
    logo: imagePathRel,
  });
}

// Read data from file unit.json
function readUnit() {
  return readData('unit.json');
}

$(function () {
  const rules = {
    name: {
      required: "Tên đơn vị không được để trống",
      min: { value: 6, message: "Tên đơn vị phải có ít nhất 6 ký tự" },
      max: { value: 100, message: "Tên đơn vị không được vượt quá 100 ký tự" },
    },
    logo: {
      required: "Logo không được để trống",
      min: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
      max: { value: 100, message: "Mật khẩu không được vượt quá 100 ký tự" },
    },
  };

  $('#unit-form').submit(async function (e) {
    e.preventDefault();
    $('#submit-unit-form').prop('disabled', true);
    const data = Object.fromEntries(new FormData(this).entries());
    let isValid = true;

    // Validate từng field theo rule
    for (const field in rules) {
      const ok = validateField(field, data[field], rules[field]);
      if (!ok) isValid = false;
    }

    if (!isValid) return;

    const formData = new FormData(this);
    await saveDataUnit(formData);

    window.location.href = 'unit.html';
  });
});

// Preview image
function previewImage(input) {
  const preview = document.querySelector('.content-image-preview');
  if (input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="Image preview" class="img-fluid">`;
    };
    reader.readAsDataURL(file);
  }
}

$(document).ready(function() {
  $('#single-image-file').change(function() {
    previewImage(this);
  });

  const rows = readUnit();

  rows.forEach(row => {
    $('#unit-table tbody').append(`
      <tr>
        <td><img src="${row.logo}" alt="Image" style="height: 40px; width: 40px;"></td>
        <td>${row.name}</td>
        <td>
          <button type="button" class="btn btn-danger btn-sm delete-unit-button" data-bs-toggle="modal" data-bs-target="#delete-unit-modal" data-id="${row.id}">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `);
  });

  $('#unit-table tbody').on('click', '.delete-unit-button', function() {
    const id = $(this).data('id');
    $('#delete-unit-id').val(id);
  });

  $('#delete-unit-form').submit(function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    console.log(formData);
    const id = $('#delete-unit-id').val();
    deleteData('unit.json', id);
  });
});