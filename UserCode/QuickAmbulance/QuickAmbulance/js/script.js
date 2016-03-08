function readURL(input) {
    document.getElementById("uploadedImage").style.display = "block";

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('uploadedImage').src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

$(document).ready(function () {
    $(document).on('change', '.btn-file :file', function () {
        document.getElementById("imgdetails").innerHTML = "Photograph selected";
    });

    $("#requesthelp").on('click', function () {
        var x = $("#requesthelp");
        x.prop('disabled', true);
        x.html('Please Wait');
        var uname = $('#username').val();
        var contact = $('#contact').val();
        validityImage = document.getElementById("uploadedImage");
        imgData = getBase64Image(validityImage);
        localStorage.setItem("uname", uname);
        localStorage.setItem("contact", contact);
        localStorage.setItem("imgdata", imgData);
        window.location.href = "showmap.html";
    });

    if(localStorage.uname) {
        $('#username').html(localStorage.uname);
    }
    if (localStorage.contact) {
        $('#contact').html(localStorage.contact);
    }
});