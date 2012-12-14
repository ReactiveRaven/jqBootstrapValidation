$(function() {

    prettyPrint();

    $("input,textarea,select").jqBootstrapValidation(
        {
            preventSubmit: true,
            submitError: function($form, event, errors) {
                // Here I do nothing, but you could do something like display 
                // the error messages to the user, log, etc.
            },
            submitSuccess: function($form, event) {
                alert("OK");
                event.preventDefault();
            }
        }
    );

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });

});