/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false, console:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global JSON:false */
/*global runJQBVTest:false, attachJqbv:false, numInJQBVTest:false, startJQBVTestQueue:false, pushJQBVTest:false, extractEvents:false*/
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

    module('jqBootstrapValidation', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
            this.elems = $("#qunit-fixture").children();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });

    test('is chainable', 1, function() {
        // Not a bad test to run on collection methods.
        strictEqual(this.elems.jqBootstrapValidation(), this.elems, 'should be chaninable');
    });

    test('tidies up events on destroy', 2, function () {
        var $input = $("#qunit-fixture input");
        var formEventsBeforeDestroy = extractEvents($input.parents("form").first());
        $input.jqBootstrapValidation("destroy");
        var inputEvents = extractEvents($input);
        var $form = $input.parents("form").first();
        var formEvents = extractEvents($form);
        
        ok(!formEvents, "Form still has lingering events");
        ok(!inputEvents, "Input still has lingering events");
    });

//    test("responds to jqbv", 1, function() {
//        strictEqual(this.elems.jqbv(), this.elems, "should register jqbv function");
//    });



    module('email field', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });

    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    
    (function () {
      var validEmails = [
        'customer/department=shipping@example.com',
        '$A12345@example.com',
        '!def!xyz%abc@example.com',
        '_somename@example.com',
        'test@example.com',
        '\u2019test\u2019@example.com'
      ];
      test('accepts valid', validEmails.length * numInJQBVTest, function() {
          $(validEmails).each(function (i, el) {
              runJQBVTest(el, ["success"], [], [], []);
          });
      });
    })();
    
    (function () {
      var invalidEmails = [
        "not an email",
        "not@anemail",
        "not@an email.com",
        "@."
      ];
      
      test('rejects invalid', invalidEmails.length * numInJQBVTest, function() {
        $(invalidEmails).each(function (i, el) {
            runJQBVTest(el, ["warning"], ["error"], ["Not a valid email address"], ["Not a valid email address"]);
        });
      });
    })();

    module('email field (sniffed)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });

    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    
    (function () {
      var validEmails = [
        'customer/department=shipping@example.com',
        '$A12345@example.com',
        '!def!xyz%abc@example.com',
        '_somename@example.com',
        'test@example.com',
        '\u2019test\u2019@example.com'
      ];
      test('accepts valid', validEmails.length * numInJQBVTest, function() {
          $(validEmails).each(function (i, el) {
              runJQBVTest(el, ["success"], [], [], []);
          });
      });
    })();
    
    (function () {
      var invalidEmails = [
        "not an email",
        "not@anemail",
        "not@an email.com",
        "@."
      ];
      
      test('rejects invalid', invalidEmails.length * numInJQBVTest, function() {
        $(invalidEmails).each(function (i, el) {
            runJQBVTest(el, ["warning"], ["error"], ["Not a valid email address"], ["Not a valid email address"]);
        });
      });
    })();

    module('number field', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });

    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test('accepts valid', 4 * numInJQBVTest, function() {
        runJQBVTest("1", ["success"], [], [], []);
        runJQBVTest("10", ["success"], [], [], []);
        runJQBVTest("-10", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });
    test('rejects invalid', 4 * numInJQBVTest, function() {
        runJQBVTest("123.", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("123.456", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("not a number", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("--.-", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
    });

    module('number field (sniffed)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 1 * numInJQBVTest, function() {
        runJQBVTest("-123", ["success"], [], [], []);
    });
    test('rejects invalid', 1 * numInJQBVTest, function() {
        runJQBVTest("123.45", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
    });

    module('number field (step)', {
        setup: function() {
            $("#qunit-fixture").append("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\\n\
                                data-validation-number-number='true'\
                                data-validation-number-step='0.001'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 4 * numInJQBVTest, function() {
        runJQBVTest("-123.456", ["success"], [], [], []);
        runJQBVTest("123.456", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("11452.199", ["success"], [], [], []);
    });
    test('rejects invalid', 2 * numInJQBVTest, function() {
        runJQBVTest("123.4567", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("123.1999", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
    });

    module('number field (decimal)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 3 * numInJQBVTest, function() {
        runJQBVTest("-123,45", ["success"], [], [], []);
        runJQBVTest("123,45", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });
    test('rejects invalid', 2 * numInJQBVTest, function() {
        runJQBVTest("123.45", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
        runJQBVTest("123,,45", ["warning"], ["error"], ["Must be a number"], ["Must be a number"]);
    });

    module('required field', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is required', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], ["error"], [], ["This is required"]);
    });
    test("accepts anything", 3 * numInJQBVTest, function() {
        runJQBVTest(" ", ["success"], [], [], []);
        runJQBVTest("hello", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });

    module('required field (sniffed)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is required', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], ["error"], [], ["This is required"]);
    });
    test("accepts anything", 3 * numInJQBVTest, function() {
        runJQBVTest(" ", ["success"], [], [], []);
        runJQBVTest("hello", ["success"], [], [], []);
        runJQBVTest("123", ["success"], [], [], []);
    });

    module('max', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 4 * numInJQBVTest, function() {
        runJQBVTest("-1000", ["success"], [], [], []);
        runJQBVTest("0", ["success"], [], [], []);
        runJQBVTest("100.00", ["success"], [], [], []);
        runJQBVTest("99.999999", ["success"], [], [], []);
    });
    test("rejects invalid", 2 * numInJQBVTest, function() {
        runJQBVTest("101", ["warning"], ["error"], ["Too high: Maximum of '100'"], ["Too high: Maximum of '100'"]);
        runJQBVTest("100.0001", ["warning"], ["error"], ["Too high: Maximum of '100'"], ["Too high: Maximum of '100'"]);
    });

    module('max (sniffed)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 4 * numInJQBVTest, function() {
        runJQBVTest("-1000", ["success"], [], [], []);
        runJQBVTest("0", ["success"], [], [], []);
        runJQBVTest("100.00", ["success"], [], [], []);
        runJQBVTest("99.999999", ["success"], [], [], []);
    });
    test("rejects invalid", 2 * numInJQBVTest, function() {
        runJQBVTest("101", ["warning"], ["error"], ["Too high: Maximum of '100'"], ["Too high: Maximum of '100'"]);
        runJQBVTest("100.0001", ["warning"], ["error"], ["Too high: Maximum of '100'"], ["Too high: Maximum of '100'"]);
    });

    module('min', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 2 * numInJQBVTest, function() {
        runJQBVTest("1000", ["success"], [], [], []);
        runJQBVTest("100", ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest("0", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
        runJQBVTest("99.999999", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
        runJQBVTest("-1000", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
    });

    module('min (sniffed)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 2 * numInJQBVTest, function() {
        runJQBVTest("1000", ["success"], [], [], []);
        runJQBVTest("100", ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest("0", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
        runJQBVTest("99.999999", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
        runJQBVTest("-1000", ["warning"], ["error"], ["Too low: Minimum of '100'"], ["Too low: Minimum of '100'"]);
    });

    module('maxlength', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 4 * numInJQBVTest, function() {
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("abc", ["success"], [], [], []);
        runJQBVTest("a", ["success"], [], [], []);
        runJQBVTest(" a ", ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest("too long", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
        runJQBVTest("abcd", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
        runJQBVTest("    ", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
    });

    module('maxlength (sniffed)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 4 * numInJQBVTest, function() {
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("abc", ["success"], [], [], []);
        runJQBVTest("a", ["success"], [], [], []);
        runJQBVTest(" a ", ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest("too long", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
        runJQBVTest("abcd", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
        runJQBVTest("    ", ["warning"], ["error"], ["Too long: Maximum of '3' characters"], ["Too long: Maximum of '3' characters"]);
    });

    module('minlength', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 4 * numInJQBVTest, function() {
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("abc", ["success"], [], [], []);
        runJQBVTest("aaaaaaaaaaa", ["success"], [], [], []);
        runJQBVTest(" a ", ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest("ab", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
        runJQBVTest("12", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
        runJQBVTest("  ", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
    });

    module('minlength (sniffed)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 4 * numInJQBVTest, function() {
        runJQBVTest("123", ["success"], [], [], []);
        runJQBVTest("abc", ["success"], [], [], []);
        runJQBVTest("abcd", ["success"], [], [], []);
        runJQBVTest("1234", ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest("ab", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
        runJQBVTest("12", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
        runJQBVTest("  ", ["warning"], ["error"], ["Too short: Minimum of '3' characters"], ["Too short: Minimum of '3' characters"]);
    });

    module('pattern', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 2 * numInJQBVTest, function() {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
        runJQBVTest("C", ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest("lower case", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("  ", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
    });

    module('pattern (sniffed)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 2 * numInJQBVTest, function() {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
        runJQBVTest("C", ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest("lower case", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("  ", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
    });

    module('match (blank other)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });

    module('match (filled other)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is required if other is filled in', 1 * numInJQBVTest, function() {
        runJQBVTest("", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
    });
    test("accepts valid", 1 * numInJQBVTest, function() {
        runJQBVTest("specific value", ["success"], [], [], []);
    });
    test("rejects invalid", 4 * numInJQBVTest, function() {
        runJQBVTest("SPECIFIC VALUE", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("specific value ", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("nonsense", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
    });

    module('match (fors missing)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is required if other is filled in', 1 * numInJQBVTest, function() {
        runJQBVTest("", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
    });
    test("accepts valid", 1 * numInJQBVTest, function() {
        runJQBVTest("specific value", ["success"], [], [], []);
    });
    test("rejects invalid", 4 * numInJQBVTest, function() {
        runJQBVTest("SPECIFIC VALUE", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("specific value ", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
        runJQBVTest("nonsense", ["warning"], ["error"], ["Must match 'Other'"], ["Must match 'Other'"]);
    });

    module('match (label missing)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is required if other is filled in', 1 * numInJQBVTest, function() {
        runJQBVTest("", ["warning"], ["error"], ["Must match"], ["Must match"]);
    });
    test("accepts valid", 1 * numInJQBVTest, function() {
        runJQBVTest("specific value", ["success"], [], [], []);
    });
    test("rejects invalid", 4 * numInJQBVTest, function() {
        runJQBVTest("SPECIFIC VALUE", ["warning"], ["error"], ["Must match"], ["Must match"]);
        runJQBVTest("specific value ", ["warning"], ["error"], ["Must match"], ["Must match"]);
        runJQBVTest("123456", ["warning"], ["error"], ["Must match"], ["Must match"]);
        runJQBVTest("nonsense", ["warning"], ["error"], ["Must match"], ["Must match"]);
    });

    module('max checked', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 3 * numInJQBVTest, function() {
        runJQBVTest(["red", "yellow", "blue"], ["success"], [], [], []);
        runJQBVTest(["red", "orange", "yellow"], ["success"], [], [], []);
        runJQBVTest(["violet", "indigo", "blue"], ["success"], [], [], []);
    });
    test("rejects invalid", 2 * numInJQBVTest, function() {
        runJQBVTest(["red", "yellow", "blue", "violet"], ["warning"], ["error"], ["Too many: Max '3' checked"], ["Too many: Max '3' checked"]);
        runJQBVTest(["orange", "yellow", "green", "blue"], ["warning"], ["error"], ["Too many: Max '3' checked"], ["Too many: Max '3' checked"]);
    });

    module('min checked', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is required', 1 * numInJQBVTest, function() {
        runJQBVTest([], ["warning"], ["error"], ["Too few: Min '3' checked"], ["Too few: Min '3' checked"]);
    });
    test("accepts valid", 3 * numInJQBVTest, function() {
        runJQBVTest(["red", "yellow", "blue"], ["success"], [], [], []);
        runJQBVTest(["red", "orange", "yellow"], ["success"], [], [], []);
        runJQBVTest(["violet", "indigo", "blue"], ["success"], [], [], []);
    });
    test("rejects invalid", 3 * numInJQBVTest, function() {
        runJQBVTest(["red", "yellow"], ["warning"], ["error"], ["Too few: Min '3' checked"], ["Too few: Min '3' checked"]);
        runJQBVTest(["orange", "violet"], ["warning"], ["error"], ["Too few: Min '3' checked"], ["Too few: Min '3' checked"]);
        runJQBVTest(["orange", "yellow"], ["warning"], ["error"], ["Too few: Min '3' checked"], ["Too few: Min '3' checked"]);
    });

    module('regex', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('is optional', 1 * numInJQBVTest, function() {
        runJQBVTest("", [], [], [], []);
    });
    test("accepts valid", 1 * numInJQBVTest, function() {
        runJQBVTest("CAPITALS", ["success"], [], [], []);
    });
    test("rejects invalid", 4 * numInJQBVTest, function() {
        runJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("lowercase", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("lower case with spaces", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
        runJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Not in the expected format"], ["Not in the expected format"]);
    });

    module('callback', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    asyncTest('is optional', 1 * numInJQBVTest, function() {
        pushJQBVTest("", [], [], [], []);
        startJQBVTestQueue();
    });
    asyncTest("accepts valid", 1 * numInJQBVTest, function() {
        pushJQBVTest("CAPITALS", ["success"], [], [], []);
        startJQBVTestQueue();
    });
    asyncTest("rejects invalid", 4 * numInJQBVTest, function() {
        pushJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        pushJQBVTest("lowercase", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        pushJQBVTest("lower case with spaces", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        pushJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        startJQBVTestQueue();
    });

    module('callback (with message)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    asyncTest('is optional', 1 * numInJQBVTest, function() {
        pushJQBVTest("", [], [], [], []);
        startJQBVTestQueue();
    });
    asyncTest("accepts valid", 1 * numInJQBVTest, function() {
        pushJQBVTest("CAPITALS", ["success"], [], [], []);
        startJQBVTestQueue();
    });
    asyncTest("rejects invalid", 4 * numInJQBVTest, function() {
        pushJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        pushJQBVTest("lowercase", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        pushJQBVTest("lower case with spaces", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        pushJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        startJQBVTestQueue();
    });

    module('callback (async)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    asyncTest('is optional', 1 * numInJQBVTest, function() {
        pushJQBVTest("", [], [], [], []);
        startJQBVTestQueue();
    });
    asyncTest("accepts valid", 1 * numInJQBVTest, function() {
        pushJQBVTest("CAPITALS", ["success"], [], [], []);
        startJQBVTestQueue();
    });
    asyncTest("rejects invalid", 4 * numInJQBVTest, function() {
        pushJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        pushJQBVTest("lowercase", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        pushJQBVTest("lower case with spaces", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        pushJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Not valid"], ["Not valid"]);
        startJQBVTestQueue();
    });

    module('callback (async with message)', {
        setup: function() {
            $("#qunit-fixture").append("\
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
            ");
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    asyncTest('is optional', 1 * numInJQBVTest, function() {
        pushJQBVTest("", [], [], [], []);
        startJQBVTestQueue();
    });
    asyncTest("accepts valid", 1 * numInJQBVTest, function() {
        pushJQBVTest("CAPITALS", ["success"], [], [], []);
        startJQBVTestQueue();
    });
    asyncTest("rejects invalid", 4 * numInJQBVTest, function() {
        pushJQBVTest("CAPITALS WITH SPACES", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        pushJQBVTest("lowercase", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        pushJQBVTest("lower case with spaces", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        pushJQBVTest("192838912!@$*@&$*#&!@1239", ["warning"], ["error"], ["Capitals only please"], ["Capitals only please"]);
        startJQBVTestQueue();
    });
  
    module('events', {
        setup: function() {
            $("#qunit-fixture").empty();
            $("#qunit-fixture").append("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='number'\
                                name='input'\
                                data-validation-max-max='42'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            ");
            $("#qunit-fixture").find("input,select,textarea").not("[type=submit]").jqBootstrapValidation(
                {
                    preventSubmit: true,
                    submitError: function($form, event, errors) {
                        // Here I do nothing, but you could do something like display 
                        // the error messages to the user, log, etc.
                    },
                    submitSuccess: function($form, event) {
                        event.preventDefault();
                    },
                    bindEvents: [
                        "focus",
                        "blur",
                        "click"
                    ]
                }
            );
        },
        teardown: function() {
        }
    });
  
    test("listens to bindEvents option", 8, function () {
        var eventsArray = [];
        
        var $input = $("#qunit-fixture [name='input']");
        
        if ($input.data("events")) {
            eventsArray = $input.data("events");
        } else if ($input._data && $input._data("events")) {
            eventsArray = $input._data("events");
        } else {
            ok(false, "cannot find the internal jQuery events array");
        }
      
        ok(eventsArray["validation"] && eventsArray["validation"].length === 1, "'validation' event always added");
        ok(eventsArray["validationLostFocus"] && eventsArray["validationLostFocus"].length === 1, "'validationLostFocus' event always added");
        
        ok(!eventsArray["change"] || eventsArray["change"].length === 0, "'change' event not added as not requested");
        ok(!eventsArray["keydown"] || eventsArray["keydown"].length === 0, "'keydown' event not added as not requested");
        ok(!eventsArray["keyup"] || eventsArray["keyup"].length === 0, "'keyup' event not added as not requested");
        
        ok(eventsArray["focus"] && eventsArray["focus"].length === 1, "'focus' event added as requested");
        ok(eventsArray["blur"] && eventsArray["blur"].length === 1, "'blur' event added as requested");
        ok(eventsArray["click"] && eventsArray["click"].length === 1, "'click' event added as requested");
    });
  
    module('events (defaults)', {
        setup: function() {
            $("#qunit-fixture").empty();
            $("#qunit-fixture").append("\
                <form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Input</label>\
                        <div class='controls'>\
                            <input\
                                type='number'\
                                name='input'\
                                data-validation-max-max='42'\
                            />\
                        </div>\
                    </div>\
                    <div class='form-actions'>\
                        <button type='submit' class='btn btn-primary'>\
                            Test Validation <i class='icon-ok icon-white'></i>\
                        </button>\
                    </div>\
                </form>\
            ");
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
        },
        teardown: function() {
        }
    });
  
    test("has sensible default events", 9, function () {
        var $input = $("#qunit-fixture [name='input']");
        
        var eventsArray = extractEvents($input);
        
        ok(!!eventsArray, "Found some events");
      
        ok(eventsArray["validation"] && eventsArray["validation"].length === 1, "'validation' event always added");
        ok(eventsArray["validationLostFocus"] && eventsArray["validationLostFocus"].length === 1, "'validationLostFocus' event always added");
        
        ok(eventsArray["focus"] && eventsArray["focus"].length === 1, "'focus' event added by default");
        ok(eventsArray["change"] && eventsArray["change"].length === 1, "'change' event added by default");
        ok(eventsArray["keydown"] && eventsArray["keydown"].length === 1, "'keydown' event added by default");
        ok(eventsArray["keyup"] && eventsArray["keyup"].length === 1, "'keyup' event added by default");
        ok(eventsArray["blur"] && eventsArray["blur"].length === 1, "'blur' event added by default");
        ok(eventsArray["click"] && eventsArray["click"].length === 1, "'click' event added by default");
    });

}(jQuery));
