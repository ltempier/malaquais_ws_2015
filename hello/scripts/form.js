$(document).ready(function () {
    $('form').submit(function () {
        var formdata = $(this).serialize();

        $.ajax({
            type: "POST",
            url: "api/people",
            data: formdata,
            success: function () {
                $("#successModal").modal()
            },
            error: function (err) {
                console.log(err)
            }
        });
        return false;
    });
});
