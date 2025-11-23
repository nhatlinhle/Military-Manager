async function handleLogin(data) {
  const users = readData('user.json');

  const user = users.find(u => u.username === data.username);

  if (!user) {
    $("#alert-login").removeClass("d-none");
    return;
  }

  if (user.password !== data.password) {
    $("#alert-login").removeClass("d-none");
    return;
  }

  const { password, ...userInfo } = user;
  localStorage.setItem("current_user", JSON.stringify(userInfo));

  window.location.href = "index.html?user-id=" + user.id;
}
$(function () {
  $("#alert-login").addClass("d-none");
  $('#login-form').submit(async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());

    await handleLogin(data);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("alert") === "register-success") {
    $("#alert-register-success").removeClass("d-none");

    params.delete("alert");

    const newUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, "", newUrl);
}
});