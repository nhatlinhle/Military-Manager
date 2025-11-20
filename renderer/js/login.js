async function handleLogin (formData) {
    const username = formData.get("username")
    const password = formData.get("password")
    if (!username || !password) {
        $("#alert-login").removeClass("d-none");
    } else {
        window.location.href = 'index.html';
    }
}

$(function () {
  $("#alert-login").addClass("d-none");
  $('#login-form').submit(async function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    await handleLogin(formData);
  });
});