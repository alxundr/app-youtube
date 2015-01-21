function init() {
    $('#btn').click(signIn);   
}

function signIn() {
    console.log("entro a signIn");
    var user = $('#username').val(),
        pass = $('#password').val(),
         url = "http://10.50.24.142:4000/login";
    jQuery.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        data: {
            username: user,
            password: pass
        },
        success: onGetSuccess,
        error: onGetFail
    });
}

function onGetSuccess(data, status, xmlhttp) {
    console.log(status);
    console.log(xmlhttp);
    var result = $('#result');
    result.html("<p>apiKey: " + data.apiKey + "</p>");
    console.log(xmlhttp.responseText);
    if (data.status === 'success') {
        $('#username').val('');
        $('#password').val('');
        window.location.replace("http://127.0.0.1:9000/?apiKey=" + data.apiKey);
    } else {
        alert('wrong username or password');
    }
}

function onGetFail(xmlhttp, status) {
    alert("Error: " + xmlhttp.responseText);
}

$(document).ready(init);
