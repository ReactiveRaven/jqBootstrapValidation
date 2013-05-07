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

}(jQuery));
