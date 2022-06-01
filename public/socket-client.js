// Made javascript file for Content-Security-Policy
var socket = io();
    socket.on('update', function(msg) {
    var item = document.getElementById('account');
    item.textContent = msg;
});