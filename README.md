jqBootstapValidation
====================

A JQuery validation framework for bootstrap forms.

## Installation ##

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
attributes; max, min, maxlength, minlength, required. 

It will also validate `<input type="email" />` fields to make sure they contain 
a valid email address.