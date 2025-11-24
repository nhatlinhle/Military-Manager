$(document).ready(function () {
  const rules = {
    password: {
      required: "Mật khẩu không được để trống",
      min: { value: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
      max: { value: 100, message: "Mật khẩu không được vượt quá 100 ký tự" },
    },
    confirm_password: {
      required: "Xác nhận mật khẩu không được để trống",
      min: { value: 8, message: "Xác nhận mật khẩu phải có ít nhất 8 ký tự" },
      max: {
        value: 100,
        message: "Xác nhận mật khẩu không được vượt quá 100 ký tự",
      },
    },
  };

  $("#change-password-form").submit(function (e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("current_user"));
    const users = readData("user.json");
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

    const usernameExists = users.some((u) => u.username === currentUser.username);

    if (usernameExists) {
      updateData("user.json", currentUser.id, data);
    }
    window.location.href = "profile.html?alert=change-password-success";
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("alert") === "change-password-success") {
    $("#alert-change-password-success").removeClass("d-none");

    params.delete("alert");

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }
});
