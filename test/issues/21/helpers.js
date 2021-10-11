/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false, console:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global importFromTd:false */
(function($) {
    window.number_of_submit_successes = 0;
    window.number_of_submit_errors = 0;

    window.attachJqbv = function() {
        $("#qunit-fixture").find("input,select,textarea").not("[type=submit]").jqBootstrapValidation(
                {
                    preventSubmit: true,
                    submitError: function($form, event, errors) {
                        // Here I do nothing, but you could do something like display 
                        // the error messages to the user, log, etc.
                        window.number_of_submit_errors++;
                    },
                    submitSuccess: function($form, event) {
                        window.number_of_submit_successes++;
                        event.preventDefault();
                    },
                    resource: function(key) {
                        return "foo";
                    }
                }
        );
    };

    window.importFromTd = function($td) {

        // Handle single items simply
        var result = $td.text();
        if (result.length > 0) {
            result = [result];
        } else {
            // literally nothing there? Guess it should be empty.
            result = [];
        }

        // if multiple items, expect them in a list
        if ($td.find("ul,ol").length) {
            result = $td.find("ol,ul").first().find("li").map(function(i, el) {
                return $(el).text();
            }).toArray();
        }

        return result;
    };

    window.numInJQBVTest = 9;

    window.jqbvTestQueue = [];

    window.runJQBVTest = function(value, classChange, classSubmit, messageChange, messageSubmit) {

        var $input = $("#qunit-fixture").find("[name=input]");
        var $controlGroup = $($input.parents(".control-group")[0]);
        var $form = $input.parents("form").first();

        var values = [value];

        var valueJson = JSON.stringify(values);

        // dealing with text, selects, etc
        $input.val(values[0]);

        deepEqual($input.val(), values[0], "value is accepted by browser - " + valueJson);

        $input.trigger("change.validation");
        var changeClassExpected = ["control-group"].concat(classChange);
        var changeClassActual = $controlGroup.attr("class").split(" ");
        deepEqual(changeClassActual, changeClassExpected, "classes as expected on change - " + valueJson);

        var changeMessageActual = importFromTd($controlGroup.find(".help-block"));
        deepEqual(changeMessageActual, messageChange, "message as expected on change - " + valueJson);

        var prevErrors = window.number_of_submit_errors;
        var prevSuccess = window.number_of_submit_successes;
        $form.trigger("submit");
        var nowErrors = window.number_of_submit_errors;
        var nowSuccess = window.number_of_submit_successes;

        var submitClassExpected = ["control-group"].concat(classSubmit);
        var submitClassActual = $controlGroup.attr("class").split(" ");
        deepEqual(submitClassActual, submitClassExpected, "classes as expected on submit - " + valueJson);

        var submitMessageExpected = messageSubmit;
        var submitMessageActual = importFromTd($controlGroup.find(".help-block"));
        deepEqual(submitMessageActual, submitMessageExpected, "message as expected on submit - " + valueJson);

        if (classSubmit.indexOf("error") > -1) {
            deepEqual(prevErrors + 1, nowErrors, "expect an error to be fired - " + valueJson);
            deepEqual(prevSuccess, nowSuccess, "DID NOT expect success to be fired - " + valueJson);
        } else {
            deepEqual(prevErrors, nowErrors, "DID NOT expect an error to be fired - " + valueJson);
            deepEqual(prevSuccess + 1, nowSuccess, "expect success to be fired - " + valueJson);
        }

        $input.trigger("change.validation");
        changeClassActual = $controlGroup.attr("class").split(" ");
        deepEqual(changeClassActual, changeClassExpected, "classes revert again on change - " + valueJson);

        changeMessageActual = importFromTd($controlGroup.find(".help-block"));
        deepEqual(changeMessageActual, messageChange, "message reverts again on change - " + valueJson);
    };

})(jQuery);