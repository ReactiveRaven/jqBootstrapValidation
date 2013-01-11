/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false, console:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global JSON:false */
/*jshint multistr: true */
(function($) {

    /*
     ======== A Handy Little QUnit Reference ========
     http://docs.jquery.com/QUnit
     
     Test methods:
     - expect(numAssertions)
     - stop(increment)
     - start(decrement)
     Test assertions:
     - ok(value, [message])
     - equal(actual, expected, [message])
     - notEqual(actual, expected, [message])
     - deepEqual(actual, expected, [message])
     - notDeepEqual(actual, expected, [message])
     - strictEqual(actual, expected, [message])
     - notStrictEqual(actual, expected, [message])
     - raises(block, [expected], [message])
     */
    
    var attachJqbv = function () {
        $("#qunit-fixture").find("input,select,textarea").not("[type=submit]").jqBootstrapValidation(
            {
                preventSubmit: true,
                submitError: function($form, event, errors) {
                    // Here I do nothing, but you could do something like display 
                    // the error messages to the user, log, etc.
                },
                submitSuccess: function($form, event) {
                    event.preventDefault();
                }
            }
        );
    };

    function importFromTd($td) {
        
        // Handle single items simply
        var result = $td.text();
        if (result.length > 0) {
            result = [ result ];
        } else {
            // literally nothing there? Guess it should be empty.
            result = [];
        }
    
        // if multiple items, expect them in a list
        if ($td.find("ul,ol").length) {
            result = $td.find("ol,ul").first().find("li").map(function (i, el) { return $(el).text(); }).toArray();
        }
    
        return result;
    }
    
    function arraysMatch(first, second) {
        return (
            $(first).not(second).length === 0 &&
            $(second).not(first).length === 0
        );
    }

    var runJQBVTest = function (value, classChange, classSubmit, messageChange, messageSubmit) {
        
        var $input = $("#qunit-fixture").find("[name=input]");
        var $controlGroup = $($input.parents(".control-group")[0]);
        var $form = $input.parents("form").first();
        var isMulti = ($input.length > 1);
        
        var values;
        if (isMulti) {
            if (value.length) {
                if (typeof value === "string") {
                    values = value.split(",");
                } else {
                    // is an array already, so just use it
                    values = value;
                }
            } else {
                values = [];
            }
        } else {
            values = [value];
        }
      
        var valueJson = JSON.stringify(values);
        

        var valueAccepted = true;

        if (isMulti) {
            // dealing with checkboxes, radioboxes, etc
            var $inputs = $input;
            $inputs.removeAttr("checked");
            $(values).each(function (i, el) {
                var $curInput = $inputs.filter("[value=\"" + el + "\"]");

                if ($curInput.length === 0) {
                    valueAccepted = false;
                } else {
                    $curInput.attr("checked", "checked");
                }
            });
        
            deepEqual(valueAccepted, true, "value is accepted by browser - " + valueJson);

        } else {
            
            // dealing with text, selects, etc
            $input.val(values[0]);
            
            deepEqual($input.val(), values[0], "value is accepted by browser - " + valueJson);
        }

        $input.trigger("change.validation");
        var changeClassExpected = ["control-group"].concat(classChange);
        var changeClassActual = $controlGroup.attr("class").split(" ");
        deepEqual(changeClassActual, changeClassExpected, "classes as expected on change - " + valueJson);

        var changeMessageActual = importFromTd($controlGroup.find(".help-block"));
        deepEqual(changeMessageActual, messageChange, "message as expected on change - " + valueJson);

        $form.trigger("submit");
        var submitClassExpected = ["control-group"].concat(classSubmit);
        var submitClassActual = $controlGroup.attr("class").split(" ");

        deepEqual(submitClassActual, submitClassExpected, "classes as expected on submit - " + valueJson);

        var submitMessageExpected = messageSubmit;
        var submitMessageActual = importFromTd($controlGroup.find(".help-block"));
        deepEqual(submitMessageActual, submitMessageExpected, "message as expected on submit - " + valueJson);
    };

    module('jqBootstrapValidation', {
        setup: function() {
            this.elems = $("#qunit-fixture").children();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });

    test('is chainable', 1, function() {
        // Not a bad test to run on collection methods.
        strictEqual(this.elems.jqBootstrapValidation(), this.elems, 'should be chaninable');
    });

//    test("responds to jqbv", 1, function() {
//        strictEqual(this.elems.jqbv(), this.elems, "should register jqbv function");
//    });

    module('email field', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-email-email='email'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });

    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test('accepts valid', 5, function() {
        runJQBVTest("test@example.com", ["success"], [], [], []);
    });
    test('rejects invalid', 15, function() {
        runJQBVTest("not an email", ["warning"], ["error"], ["Not a valid email address"], ["Not a valid email address"]);
        runJQBVTest("not@anemail", ["warning"], ["error"], ["Not a valid email address"], ["Not a valid email address"]);
        runJQBVTest("not@an email.com", ["warning"], ["error"], ["Not a valid email address"], ["Not a valid email address"]);
    });

    module('email field (sniffed)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='email'\
                                name='input'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });

    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test('accepts valid', 5, function() {
        runJQBVTest("test@example.com", ["success"], [], [], []);
    });
    test('rejects invalid', 15, function() {
        runJQBVTest("not an email", ["warning"], ["error"], ["Not a valid email address"], ["Not a valid email address"]);
        runJQBVTest("not@anemail", ["warning"], ["error"], ["Not a valid email address"], ["Not a valid email address"]);
        runJQBVTest("not@an email.com", ["warning"], ["error"], ["Not a valid email address"], ["Not a valid email address"]);
    });

    module('number field', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-number-number='number'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });

    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test('accepts valid', 20, function() {
        runJQBVTest("1", ["success"], [], [], []);
        runJQBVTest("10", ["success"], [], [], []);
        runJQBVTest("-10", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });
    test('rejects invalid', 20, function() {
        runJQBVTest("123.", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("123.456", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("not a number", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("--.-", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
    });

    module('number field (sniffed)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='number'\
                                name='input'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("-123", ["success"], [], [], []);
    });
    test('rejects invalid', 5, function() {
        runJQBVTest("123.45", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
    });

    module('number field (step)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\\n\
                                data-validation-number-number='true'\
                                data-validation-number-step='0.01'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 15, function () {
        runJQBVTest("-123.45", ["success"], [], [], []);
        runJQBVTest("123.45", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });
    test('rejects invalid', 5, function() {
        runJQBVTest("123.456", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
    });

    module('number field (decimal)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\\n\
                                data-validation-number-number='true'\
                                data-validation-number-step='0.01'\
                                data-validation-number-decimal=','\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 15, function () {
        runJQBVTest("-123,45", ["success"], [], [], []);
        runJQBVTest("123,45", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });
    test('rejects invalid', 10, function() {
        runJQBVTest("123.45", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("123,,45", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
    });

    module('required field', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\\n\
                                data-validation-required-required='true'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is required', 5, function() {
        runJQBVTest("", [], ["error"], [], ["This is required"]);
    });
    test("accepts anything", 15, function () {
        runJQBVTest(" ", ["success"], [], [], []);
        runJQBVTest("hello", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });

    module('required field (sniffed)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                required='required'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is required', 5, function() {
        runJQBVTest("", [], ["error"], [], ["This is required"]);
    });
    test("accepts anything", 15, function () {
        runJQBVTest(" ", ["success"], [], [], []);
        runJQBVTest("hello", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });

    module('max', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-max-max='100'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 20, function () {
        runJQBVTest("-1000", ["success"], [], [], []);
        runJQBVTest("0", ["success"], [], [], []);
        runJQBVTest("100.00", ["success"], [], [], []);
        runJQBVTest("99.999999", ["success"], [], [], []);
    });
    test("rejects invalid", 10, function () {
        runJQBVTest("101", ["warning"], ["error"], ["Too high: Maximum of '100'"], ["Too high: Maximum of '100'"]);
        runJQBVTest("100.0001", ["warning"], ["error"], ["Too high: Maximum of '100'"], ["Too high: Maximum of '100'"]);
    });

    module('max (sniffed)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                max='100'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 20, function () {
        runJQBVTest("-1000", ["success"], [], [], []);
        runJQBVTest("0", ["success"], [], [], []);
        runJQBVTest("100.00", ["success"], [], [], []);
        runJQBVTest("99.999999", ["success"], [], [], []);
    });
    test("rejects invalid", 10, function () {
        runJQBVTest("101", ["warning"], ["error"], ["Too high: Maximum of '100'"], ["Too high: Maximum of '100'"]);
        runJQBVTest("100.0001", ["warning"], ["error"], ["Too high: Maximum of '100'"], ["Too high: Maximum of '100'"]);
    });

    module('min', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-min-min='100'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 10, function () {
        runJQBVTest("1000", ["success"], [], [], []);
        runJQBVTest("100", ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest("0", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
        runJQBVTest("99.999999", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
        runJQBVTest("-1000", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
    });

    module('min (sniffed)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                min='100'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 10, function () {
        runJQBVTest("1000", ["success"], [], [], []);
        runJQBVTest("100", ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest("0", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
        runJQBVTest("99.999999", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
        runJQBVTest("-1000", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
    });

    module('maxlength', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-maxlength-maxlength='3'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 20, function () {
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("abc", ["success"], [], [], []);
        runJQBVTest("a", ["success"], [], [], []);
        runJQBVTest(" a ", ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest("too long", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
        runJQBVTest("abcd", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
        runJQBVTest("    ", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
    });

    module('maxlength (sniffed)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-maxlength-maxlength='3'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 20, function () {
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("abc", ["success"], [], [], []);
        runJQBVTest("a", ["success"], [], [], []);
        runJQBVTest(" a ", ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest("too long", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
        runJQBVTest("abcd", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
        runJQBVTest("    ", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
    });

    module('minlength', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-minlength-minlength='3'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 20, function () {
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("abc", ["success"], [], [], []);
        runJQBVTest("aaaaaaaaaaa", ["success"], [], [], []);
        runJQBVTest(" a ", ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest("ab", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
        runJQBVTest("12", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
        runJQBVTest("  ", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
    });

    module('minlength (sniffed)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-minlength-minlength='3'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 20, function () {
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("abc", ["success"], [], [], []);
        runJQBVTest("abcd", ["success"], [], [], []);
        runJQBVTest("1234", ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest("ab", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
        runJQBVTest("12", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
        runJQBVTest("  ", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
    });

    module('pattern', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-pattern-pattern='[A-Z]*'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 10, function () {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
        runJQBVTest("C", ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest("lower case", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("  ", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
    });

    module('pattern (sniffed)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                pattern='[A-Z]*'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 10, function () {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
        runJQBVTest("C", ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest("lower case", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("  ", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
    });

    module('match (blank other)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label for='other' class='control-label'>Other</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='other'\
                                value=''\
                                disabled\
                            />\
                        </div>\
                    </div>\
                    <div class='control-group'>\
                        <label for='input' class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-match-match='other'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
  
    module('match (filled other)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label for='other' class='control-label'>Other</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='other'\
                                value='specific value'\
                                disabled\
                            />\
                        </div>\
                    </div>\
                    <div class='control-group'>\
                        <label for='input' class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-match-match='other'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is required if other is filled in', 5, function() {
        runJQBVTest("", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("specific value", ["success"], [], [], []);
    });
    test("rejects invalid", 20, function () {
        runJQBVTest("SPECIFIC VALUE", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("specific value ", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("nonsense", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
    });

    module('match (fors missing)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Other</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='other'\
                                value='specific value'\
                                disabled\
                            />\
                        </div>\
                    </div>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-match-match='other'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is required if other is filled in', 5, function() {
        runJQBVTest("", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("specific value", ["success"], [], [], []);
    });
    test("rejects invalid", 20, function () {
        runJQBVTest("SPECIFIC VALUE", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("specific value ", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("nonsense", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
    });

    module('match (label missing)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='other'\
                                value='specific value'\
                                disabled\
                            />\
                        </div>\
                    </div>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-match-match='other'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is required if other is filled in', 5, function() {
        runJQBVTest("", ["warning"], ["error"], ["Must match"], ["Must match"]);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("specific value", ["success"], [], [], []);
    });
    test("rejects invalid", 20, function () {
        runJQBVTest("SPECIFIC VALUE", ["warning"], ["error"], ["Must match"], ["Must match"]);
        runJQBVTest("specific value ", ["warning"], ["error"], ["Must match"], ["Must match"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Must match"], ["Must match"]);
        runJQBVTest("nonsense", ["warning"], ["error"], ["Must match"], ["Must match"]);
    });

    module('max checked', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label for='input' class='control-label'>Choose Three</label>\
                        <div class='controls'>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='red'\
                                    data-validation-maxchecked-maxchecked='3'\
                                />\
                                Red\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='orange'\
                                />\
                                Orange\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='yellow'\
                                />\
                                Yellow\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='green'\
                                />\
                                Green\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='blue'\
                                />\
                                Blue\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='indigo'\
                                />\
                                Indigo\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='violet'\
                                />\
                                Violet\
                            </label>\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 15, function () {
        runJQBVTest(["red", "yellow", "blue"], ["success"], [], [], []);
        runJQBVTest(["red", "orange", "yellow"], ["success"], [], [], []);
        runJQBVTest(["violet", "indigo", "blue"], ["success"], [], [], []);
    });
    test("rejects invalid", 10, function () {
        runJQBVTest(["red", "yellow", "blue", "violet"], ["warning"], ["error"], ["Too many: Max '3' checked"], ["Too many: Max '3' checked"]);
        runJQBVTest(["orange", "yellow", "green", "blue"], ["warning"], ["error"], ["Too many: Max '3' checked"], ["Too many: Max '3' checked"]);
    });

    module('min checked', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label for='input' class='control-label'>Choose Three</label>\
                        <div class='controls'>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='red'\
                                    data-validation-minchecked-minchecked='3'\
                                />\
                                Red\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='orange'\
                                />\
                                Orange\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='yellow'\
                                />\
                                Yellow\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='green'\
                                />\
                                Green\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='blue'\
                                />\
                                Blue\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='indigo'\
                                />\
                                Indigo\
                            </label>\
                            <label class='checkbox'>\
                                <input\
                                    type='checkbox'\
                                    name='input'\
                                    value='violet'\
                                />\
                                Violet\
                            </label>\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is required', 5, function() {
        runJQBVTest([], ["warning"], ["error"], ["Too few: Min '3' checked"], ["Too few: Min '3' checked"]);
    });
    test("accepts valid", 15, function () {
        runJQBVTest(["red", "yellow", "blue"], ["success"], [], [], []);
        runJQBVTest(["red", "orange", "yellow"], ["success"], [], [], []);
        runJQBVTest(["violet", "indigo", "blue"], ["success"], [], [], []);
    });
    test("rejects invalid", 15, function () {
        runJQBVTest(["red", "yellow"], ["warning"], ["error"], ["Too few: Min '3' checked"], ["Too few: Min '3' checked"]);
        runJQBVTest(["orange", "violet"], ["warning"], ["error"], ["Too few: Min '3' checked"], ["Too few: Min '3' checked"]);
        runJQBVTest(["orange", "yellow"], ["warning"], ["error"], ["Too few: Min '3' checked"], ["Too few: Min '3' checked"]);
    });

    module('regex', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-regex-regex='[A-Z]+'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
    });
    test("rejects invalid", 20, function () {
        runJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("lowercase", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("lower case with spaces", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
    });

    module('callback', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-callback-callback='testCapitalsSynchronousCallback'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
    });
    test("rejects invalid", 20, function () {
        runJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        runJQBVTest("lowercase", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        runJQBVTest("lower case with spaces", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        runJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
    });

    module('callback (with message)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-callback-callback='testCapitalsSynchronousCallbackWithMessage'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
    });
    test("rejects invalid", 20, function () {
        runJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        runJQBVTest("lowercase", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        runJQBVTest("lower case with spaces", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        runJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
    });

    module('callback (async)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-callback-callback='testCapitalsAsynchronousCallback'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
    });
    test("rejects invalid", 20, function () {
        runJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        runJQBVTest("lowercase", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        runJQBVTest("lower case with spaces", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        runJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
    });

    module('callback (async with message)', {
        setup: function () {
            $("#qunit-fixture").append($("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\
                                data-validation-callback-callback='testCapitalsAsynchronousCallbackWithMessage'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            "));
            attachJqbv();
        },
        teardown: function () {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 5, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 5, function () {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
    });
    test("rejects invalid", 20, function () {
        runJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        runJQBVTest("lowercase", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        runJQBVTest("lower case with spaces", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        runJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
    });

}(jQuery));