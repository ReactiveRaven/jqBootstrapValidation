$(function() {

    $("input,textarea,select").jqBootstrapValidation(
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