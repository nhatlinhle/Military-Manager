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

  function showError(field, message) {
    const $err = $(`#${field}-error`);
    $err.text(message).addClass("color-error-validate");
  }

  function clearError(field) {
    const $err = $(`#${field}-error`);
    $err.text("").removeClass("color-error-validate");
  }

  function validateField(field, value, ruleSet) {
    clearError(field);

    if (ruleSet.required && !value) {
      showError(field, ruleSet.required);
      return false;
    }
    if (ruleSet.min && value.length < ruleSet.min.value) {
      showError(field, ruleSet.min.message);
      return false;
    }
    if (ruleSet.max && value.length > ruleSet.max.value) {
      showError(field, ruleSet.max.message);
      return false;
    }
    return true;
  }

  $("#register-form").submit(function (e) {
    e.preventDefault();

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

    if (!isValid) return;

    console.log(data);
  });
});
