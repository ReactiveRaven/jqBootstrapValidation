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

    module('load test', {
        setup: function() {
            $("#qunit-fixture").append($("#large-form").html());
            attachJqbv();
        },
        teardown: function() {
            $("#qunit-fixture").empty();
        }
    });
    test('runs quickly', 1, function() {
        var $form = $("#qunit-fixture form").first();
        var start = new Date();
        $form.trigger("submit");
        var elapsed = new Date() - start;
        var inputCount = $("#qunit-fixture form").find("textarea,input,select").not("[type=submit]").length;
        var timeAllowed = 25 * inputCount; // runs much slower in Grunt than a real browser, should aim for 30% of budget in browser.
        var percent = Math.floor((elapsed / timeAllowed) * 100) + "%";
        ok(
          elapsed < timeAllowed,
          "Should run submit checks in less than " + timeAllowed + "ms - took " + elapsed + "ms; " + percent + " of budget."
        );
        console.log("Should run submit checks in less than " + timeAllowed + "ms - took " + elapsed + "ms; " + percent + " of budget.");
    });

}(jQuery));
