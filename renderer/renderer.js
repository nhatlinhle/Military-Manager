window.$ = window.jQuery = require('jquery');
const uuidv4 = require('uuid').v4;
window.uuidv4 = uuidv4;

$(function() {
  console.log("jQuery OK!");
});