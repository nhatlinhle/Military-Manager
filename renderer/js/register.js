$(document).ready(function () {
  const rules = {
    username: {
      required: "Tên đăng nhập không được để trống",
      min: { value: 3, message: "Tên đăng nhập phải có ít nhất 3 ký tự" },
      max: { value: 100, message: "Tên đăng nhập không được vượt quá 100 ký tự" },
    },
    password: {
      required: "Mật khẩu không được để trống",
      min: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
      max: { value: 100, message: "Mật khẩu không được vượt quá 100 ký tự" },
    },
    confirm_password: {
      required: "Xác nhận mật khẩu không được để trống",
      min: { value: 8, message: "Xác nhận mật khẩu phải có ít nhất 8 ký tự" },
      max: { value: 100, message: "Xác nhận mật khẩu không được vượt quá 100 ký tự" },
    }
  };

  $("#register-form").submit(function (e) {
    e.preventDefault();

    const users = readData('user.json');
    const data = Object.fromEntries(new FormData(this).entries());
    let isValid = true;

    // Validate từng field theo rule
    for (const field in rules) {
      const ok = validateField(field, data[field], rules[field]);
      if (!ok) isValid = false;
    }

    // Validate riêng phần confirm password
    if (data.password !== data.confirm_password) {
      showError("confirm_password", "Mật khẩu và xác nhận mật khẩu không khớp");
      isValid = false;
    }

    const usernameExists = users.some(u => u.username === data.username);

    if (usernameExists) {
      showError("username", "Tên đăng nhập đã tồn tại");
      isValid = false;
    }

    if (!isValid) return;

    saveDataUser(data);
  });

  const saveDataUser = (data) => {
    saveData('user.json', {
      id: uuidv4(),
      username: data.username,
      password: data.password,
    });
    $("#alert-register").removeClass("d-none");
  }
});
