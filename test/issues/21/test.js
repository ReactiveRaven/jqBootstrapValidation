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
    
    module('customized message', {
        setup: function() {
            $("#qunit-fixture").append("<form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input \
                                type='text'\
                                name='input'\\n\
                                required\n\
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
        runJQBVTest("", [], ["error"], [], ["foo"]);
    });
    
    
   module('inline message', {
        setup: function() {
            $("#qunit-fixture").append("<form class='form-horizontal' novalidate>\
                    <div class='control-group'>\
                        <label class='control-label'>Email address</label>\
                        <div class='controls'>\
                            <input\
                                type='text'\
                                name='input'\\n\
                                required\n\\n\
                                data-validation-required-message='bar'\
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
    
    test('is required', 1 * numInJQBVTest , function() {
        runJQBVTest("", [], ["error"], [], ["bar"]);
    });

}(jQuery));
