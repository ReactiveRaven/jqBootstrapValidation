jqBootstapValidation
====================

A JQuery validation framework for bootstrap forms.

Displays validation errors in `help-block` elements as users type.

 * Enough already! Show me some samples.

 * [Installation](#installation)
 * [Customising validation messages](#customising-validation-messages)
 * [Create your own validators](#create-your-own-validators)

## Installation

Copy [jQuery](http://jquery.com) and jqBootstrapValidaiton to your server 
and include them in your page:

    <script src="/js/jQuery.js"></script>
	<script src="/js/jqBootstrapValidation.js"></script>

When the document is ready, tell jqBootstrapValidation which elements it 
should be validating by calling jqBootstrapValidation on a jQuery collection:

    <script>
        $(function () {
            $("input,select,textarea").not("[type=submit]").jqBootstrapValidation();
        });
    </script>

jqBootstrapValidation will now detect the most common HTML5 validation 
attributes; max, min, maxlength, minlength, required, pattern.

It will also validate `<input type="email" />` fields to make sure they contain 
a valid email address.

## Customising validation messages

If you inspect the list of errors, you may notice comments similar to this one: `<!-- data-validator-required-message to override -->`

jqBootstrapValidation uses [data attributes](http://ejohn.org/blog/html-5-data-attributes/) 
to store validation information directly on the element we want to validate, 
so to change the message for a required field, all you need to do is add the 
`data-validator-required-message` attribute somewhere in the tag:

    <input required type="text" name="name" data-validator-required-message="But we haven't been introduced!" />

All jqBootstrapValidation data attributes:

 * start with: `data-validator-`
 * followed by the validator name: `required`
 * followed by the key to pass to the validator: `message`

The most common key is "message", displayed when a validator fails.

## Adding extra validators

There are two ways of adding validators.

## Create your own validators

Validators can 