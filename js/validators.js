// Hello there!
// 
// This isn't anything you'll need to include in your site.
// Its just stuff for the docs.
// 
////////////////////////////////////////////////////////////////////////////////

$(function () {
    $("input,textarea,select").not("[type=image],[type=submit]").jqBootstrapValidation(
        {
            preventSubmit: true,
            submitError: function($form, event, errors) {
                // Here I do nothing, but you could do something like display 
                // the error messages to the user, log, etc.
            },
            submitSuccess: function($form, event) {
                alert("OK\n\n" + decodeURIComponent($form.serialize().replace(/&/g, "\n")));
                event.preventDefault();
            }
        }
    );
});