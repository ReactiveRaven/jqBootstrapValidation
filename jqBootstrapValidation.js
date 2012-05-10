/* jqBootstrapValidation
 * A plugin for automating validation on Twitter Bootstrap formatted forms.
 * 
 * v1.0
 * 
 * http://www.github.com/ReactiveRaven/jqBootstrapValidation/
 */

(function( $ ){
	
	function regexFromString(inputstring) {
		// http://stackoverflow.com/questions/874709/converting-user-input-string-to-regular-expression#answer-874742

		//var flags = inputstring.replace(/.*\/([gimy]*)$/, '$1');
		//var pattern = inputstring.replace(new RegExp('^/(.*?)/'+flags+'$'), '$1');
		var regex = new RegExp("^" + inputstring + "$"); //pattern, flags);

		return regex;	
	}
	
	var defaults = {
		options: {
			lookupValidators: false, // TODO
			sniffHtml: true, // sniff for 'required', 'maxlength', etc
			preventSubmit: false // stop the form submit event from firing
		},
		validatorTypes: {
			regex: {
				name: "regex",
				init: function ($this, name) {
					return {regex: regexFromString($this.data("validation" + name + "Regex"))};
				},
				validate: function ($this, value, validator) {
					return (!validator.regex.test(value) && ! validator.negative) 
						|| (validator.regex.test(value) && validator.negative);
				}
			},
			required: {
				name: "required",
				init: function ($this, name) {
					return {};
				},
				validate: function ($this, value, validator) {
					return (value == false && ! validator.negative)
						|| (value == true && validator.negative);
				}
			},
			match: {
				name: "match",
				init: function ($this, name) {
					var element = $this.parents("form").first().find("[name=\"" + $this.data("validation" + name + "Match") + "\"]").first();
					element.bind("validation.validation", function () {
						$this.trigger("change.validation");
					});
					return {"element": element};
				},
				validate: function ($this, value, validator) {
					return (value != validator.element.val() && ! validator.negative) 
						|| (value == validator.element.val() && validator.negative);
				}
			},
			max: {
				name: "max",
				init: function ($this, name) {
					return {max: $this.data("validation" + name + "Max")};
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value, 10) > parseFloat(validator.max, 10) && ! validator.negative) 
						|| (parseFloat(value, 10) <= parseFloat(validator.max, 10) && validator.negative);
				}
			},
			min: {
				name: "min",
				init: function ($this, name) {
					return {min: $this.data("validation" + name + "Min")};
				},
				validate: function ($this, value, validator) {
					return (parseFloat(value) < parseFloat(validator.min) && ! validator.negative) 
						|| (parseFloat(value) >= parseFloat(validator.min) && validator.negative);
				}
			},
			maxlength: {
				name: "maxlength",
				init: function ($this, name) {
					return {maxlength: $this.data("validation" + name + "Maxlength")};
				},
				validate: function ($this, value, validator) {
					return ((value.length > validator.maxlength) && ! validator.negative)
						|| ((value.length <= validator.maxlength) && validator.negative);
				}
			},
			minlength: {
				name: "minlength",
				init: function ($this, name) {
					return {minlength: $this.data("validation" + name + "Minlength")};
				},
				validate: function ($this, value, validator) {
					return ((value.length <= validator.minlength) && ! validator.negative) 
						|| ((value.length > validator.minlength) && validator.negative);
				}
			},
			maxchecked: {
				name: "maxchecked",
				init: function ($this, name) {
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function () {
						$this.trigger("change.validation");
					});
					return {maxchecked: $this.data("validation" + name + "Maxchecked"), elements: elements};
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length > validator.maxchecked && ! validator.negative)
						|| (validator.elements.filter(":checked").length <= validator.maxchecked && validator.negative);
				}
			},
			minchecked: {
				name: "minchecked",
				init: function ($this, name) {
					var elements = $this.parents("form").first().find("[name=\"" + $this.attr("name") + "\"]");
					elements.bind("click.validation", function () {
						$this.trigger("change.validation");
					});
					return {minchecked: $this.data("validation" + name + "Minchecked"), elements: elements};
				},
				validate: function ($this, value, validator) {
					return (validator.elements.filter(":checked").length < validator.minchecked && ! validator.negative)
						|| (validator.elements.filter(":checked").length >= validator.minchecked && validator.negative);
				}
			}
		},
		builtInValidators: {
			email: {
				name: "Email",
				type: "shortcut",
				shortcut: "validemail"
			},
			validemail: {
				name: "Validemail",
				type: "regex",
				regex: "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\.[A-Za-z]{2,4}",
				message: "Not a valid email address<!-- data-validator-validemail-message to override -->"
			},
			passwordagain: {
				name: "Passwordagain",
				type: "match",
				match: "password",
				message: "Does not match the given password<!-- data-validator-paswordagain-message to override -->"
			},
			positive: {
				name: "Positive",
				type: "shortcut",
				shortcut: "number,positivenumber"
			},
			negative: {
				name: "Negative",
				type: "shortcut",
				shortcut: "number,negativenumber"
			},
			number: {
				name: "Number",
				type: "regex",
				regex: "[+-]?\\\d+(\\\.\\\d*)?",
				message: "Must be a number<!-- data-validator-number-message to override -->"
			},
			integer: {
				name: "Integer",
				type: "regex",
				regex: "[+-]?\\\d+",
				message: "No decimal places allowed<!-- data-validator-integer-message to override -->"
			},
			positivenumber: {
				name: "Positivenumber",
				type: "min",
				min: 0,
				message: "Must be a positive number<!-- data-validator-positivenumber-message to override -->"
			},
			negativenumber: {
				name: "Negativenumber",
				type: "max",
				max: 0,
				message: "Must be a negative number<!-- data-validator-negativenumber-message to override -->"
			},
			required: {
				name: "Required",
				type: "required",
				message: "This is required<!-- data-validator-required-message to override -->"
			},
			checkone: {
				name: "Checkone",
				type: "minchecked",
				minchecked: 1,
				message: "Check at least one option<!-- data-validation-checkone-message to override -->"
			}
		}
	};
	
	var formatValidatorName = function (name) {
		return name
			.toLowerCase()
			.replace(
				/(^|\s)([a-z])/g , 
				function(m,p1,p2) {
					return p1+p2.toUpperCase();
				}
			)
		;
	}
	
	var getValue = function ($this) {
		// Extract the value we're talking about
		var value = $this.val();
		var type = $this.attr("type");
		if (type == "checkbox") {
			value = ($this.is(":checked") ? "1" : "0");
		}
		if (type == "radio") {
			value = ($('input[name="' + $this.attr("name") + '"]:checked').length > 0 ? "1" : "0");
		}
		return value;
	}

	var methods = {	
		init : function( options ) {

			var settings = $.extend(true, defaults, options);
			
			var $siblingElements = this;
			
			$siblingElements.first().parents("form").bind("submit", function (e) {
				var $form = $(this);
				if (settings.options.preventSubmit) {
					var warningsFound = 0;
					$siblingElements.trigger("change.validation").each(function (i, el) {
						var $this = $(el),
							$controlGroup = $this.parents(".control-group").first(),
							myValidators = $this.triggerHandler("getValidators.validation"),
							value = getValue($this);
							
						if (
							$controlGroup.hasClass("warning") 
							|| $this.triggerHandler("validation.validation", true).length
						) {
							$controlGroup.removeClass("warning").addClass("error");
							warningsFound++;
						}
					}).trigger("validationLostFocus.validation");
					
					if (warningsFound > 0) {
						e.preventDefault();
					}
				}
			})

			return this.each(function(){

				// Get references to everything we're interested in
				var $this = $(this),
					$controlGroup = $this.parents(".control-group").first(),
					$helpBlock = $controlGroup.find(".help-block").first(),
					$form = $this.parents("form").first(),
					validatorNames = [];
					
				// =============================================================
				//                                     SNIFF HTML FOR VALIDATORS
				// =============================================================
				
				if (settings.options.sniffHtml) {
					var message = "";
					// ---------------------------------------------------------
					//                                                   PATTERN
					// ---------------------------------------------------------
					if ($this.attr("pattern") !== undefined) {
						message = "Not in the expected format<!-- data-validation-pattern-message to override -->";
						if ($this.data("validationPatternMessage")) {
							message = $this.data("validationPatternMessage");
						}
						$this.data("validationRegexMessage", message);
						$this.data("validationRegexRegex", $this.attr("pattern"));
					}
					// ---------------------------------------------------------
					//                                                       MAX
					// ---------------------------------------------------------
					if ($this.attr("max") !== undefined) {
						message = "Too high: Maximum of '" + $this.attr("max") + "'<!-- data-validation-max-message to override -->";
						if ($this.data("validationMaxMessage")) {
							message = $this.data("validationMaxMessage");
						}
						$this.data("validationMaxMessage", message);
						$this.data("validationMaxMax", $this.attr("max"));
					}
					// ---------------------------------------------------------
					//                                                       MIN
					// ---------------------------------------------------------
					if ($this.attr("min") !== undefined) {
						message = "Too low: Minimum of '" + $this.attr("min") + "'<!-- data-validation-min-message to override -->";
						if ($this.data("validationMinMessage")) {
							message = $this.data("validationMinMessage");
						}
						$this.data("validationMinMessage", message);
						$this.data("validationMinMin", $this.attr("min"));
					}
					// ---------------------------------------------------------
					//                                                 MAXLENGTH
					// ---------------------------------------------------------
					if ($this.attr("maxlength") !== undefined) {
						message = "Too long: Maximum of '" + $this.attr("maxlength") + "' characters<!-- data-validation-maxlength-message to override -->";
						if ($this.data("validationMaxlengthMessage")) {
							message = $this.data("validationMaxlengthMessage");
						}
						$this.data("validationMaxlengthMessage", message);
						$this.data("validationMaxlengthMaxlength", $this.attr("maxlength"));
					}
					// ---------------------------------------------------------
					//                                                 MINLENGTH
					// ---------------------------------------------------------
					if ($this.attr("minlength") !== undefined) {
						message = "Too short: Minimum of '" + $this.attr("minlength") + "' characters<!-- data-validation-minlength-message to override -->";
						if ($this.data("validationMinlengthMessage")) {
							message = $this.data("validationMinlengthMessage");
						}
						$this.data("validationMinlengthMessage", message);
						$this.data("validationMinlengthMinlength", $this.attr("minlength"));
					}
					// ---------------------------------------------------------
					//                                                  REQUIRED
					// ---------------------------------------------------------
					if ($this.attr("required") !== undefined) {
						message = settings.builtInValidators.required.message;
						if ($this.data("validationRequiredMessage")) {
							message = $this.data("validationRequiredMessage");
						}
						$this.data("validationRequiredMessage", message);
					}
					// ---------------------------------------------------------
					//                                                    NUMBER
					// ---------------------------------------------------------
					if ($this.attr("type") == "number") {
						message = settings.builtInValidators.number.message;
						if ($this.data("validationNumberMessage")) {
							message = $this.data("validationNumberMessage");
						}
						$this.data("validationNumberMessage", message);
					}
					// ---------------------------------------------------------
					//                                                     EMAIL
					// ---------------------------------------------------------
					if ($this.attr("type").toLowerCase() == "email") {
						message = "Not a valid email address<!-- data-validator-validemail-message to override -->";
						if ($this.data("validationValidemailMessage")) {
							message = $this.data("validationValidemailMessage");
						}
						$this.data("validationValidemailMessage", message);
					}
					// ---------------------------------------------------------
					//                                                MINCHECKED
					// ---------------------------------------------------------
					if ($this.attr("minchecked") !== undefined) {
						message = "Not enough options checked; Minimum of '" + $this.attr("minchecked") + "' required<!-- data-validation-minchecked-message to override -->";
						if ($this.data("validationMincheckedMessage")) {
							message = $this.data("validationMincheckedMessage");
						}
						$this.data("validationMincheckedMessage", message);
						$this.data("validationMincheckedMinchecked", $this.attr("minchecked"));
					}
					// ---------------------------------------------------------
					//                                                MAXCHECKED
					// ---------------------------------------------------------
					if ($this.attr("maxchecked") !== undefined) {
						alert("Maxchecked");
						message = "Too many options checked; Maximum of '" + $this.attr("maxchecked") + "' required<!-- data-validation-maxchecked-message to override -->";
						if ($this.data("validationMaxcheckedMessage")) {
							message = $this.data("validationMaxcheckedMessage");
						}
						$this.data("validationMaxcheckedMessage", message);
						$this.data("validationMaxcheckedMaxchecked", $this.attr("maxchecked"));
					}
				}
					
				// =============================================================
				//                                       COLLECT VALIDATOR NAMES
				// =============================================================

				// Get named validators
				if ($this.data("validation") != undefined) {
					validatorNames = $this.data("validation").split(",");
				}

				// Get extra ones defined on the element's data attributes
				$.each($this.data(), function (i, el) {
					var parts = i.replace(/([A-Z])/g, ",$1").split(",");
					if (parts[0] == "validation" && parts[1]) {
						validatorNames.push(parts[1]);
					}
				});
				
				// =============================================================
				//                                     NORMALISE VALIDATOR NAMES
				// =============================================================
				
				var validatorNamesToInspect = validatorNames;
				var newValidatorNamesToInspect = [];
				
				do // repeatedly expand 'shortcut' validators into their real validators
				{
					// Uppercase only the first letter of each name
					$.each(validatorNames, function (i, el) {
						validatorNames[i] = formatValidatorName(el);
					});
					
					// Remove duplicate validator names
					validatorNames = $.unique(validatorNames);
					
					// Pull out the new validator names from each shortcut
					newValidatorNamesToInspect = [];
					$.each(validatorNamesToInspect, function(i, el) {
						if ($this.data("validation" + el + "Shortcut") != undefined) {
							// Are these custom validators?
							// Pull them out!
							$.each($this.data("validation" + el + "Shortcut").split(","), function(i2, el2) {
								newValidatorNamesToInspect.push(el2);
							});
						} else if (settings.builtInValidators[el.toLowerCase()]) {
							// Is this a recognised built-in?
							// Pull it out!
							var validator = settings.builtInValidators[el.toLowerCase()];
							if (validator.type.toLowerCase() == "shortcut") {
								$.each(validator.shortcut.split(","), function (i, el) {
									el = formatValidatorName(el);
									newValidatorNamesToInspect.push(el);
									validatorNames.push(el);
								});
							}
						}
					});
					
					validatorNamesToInspect = newValidatorNamesToInspect;

				} while (validatorNamesToInspect.length > 0)
				
				// =============================================================
				//                                       SET UP VALIDATOR ARRAYS 
				// =============================================================
					
				var validators = {};
				
				$.each(validatorNames, function (i, el) {
					// Set up the 'override' message
					var message = $this.data("validation" + el + "Message");
					var hasOverrideMessage = (message != undefined);
					var foundValidator = false;
					message = 
						(
							message 
								? message 
								: "'" + el + "' validation failed <!-- Add attribute 'data-validation-" + el.toLowerCase() + "-message' to input to change this message -->"
						)
					;
					
					$.each(
						settings.validatorTypes, 
						function (validatorType, validatorTemplate) {
							if (validators[validatorType] == undefined) {
								validators[validatorType] = [];
							}
							if (!foundValidator && $this.data("validation" + el + formatValidatorName(validatorTemplate.name)) !== undefined) {
								validators[validatorType].push(
									$.extend(
										true,
										{
											name: formatValidatorName(validatorTemplate.name),
											message: message
										}, 
										validatorTemplate.init($this, el)
									)
								);
								foundValidator = true;
							}
						}
					);
					
					if (!foundValidator && settings.builtInValidators[el.toLowerCase()]) {
						
						var validator = $.extend(true, {}, settings.builtInValidators[el.toLowerCase()]);
						if (hasOverrideMessage) {
							validator.message = message;
						}
						var validatorType = validator.type.toLowerCase();
						
						if (validatorType == "shortcut") {
							foundValidator = true;
						} else {
							$.each(
								settings.validatorTypes,
								function (validatorTemplateType, validatorTemplate) {
									if (validators[validatorTemplateType] == undefined) {
										validators[validatorTemplateType] = [];
									}
									if (!foundValidator && validatorType == validatorTemplateType.toLowerCase()) {
										$this.data("validation" + el + formatValidatorName(validatorTemplate.name), validator[validatorTemplate.name.toLowerCase()])
										validators[validatorType].push(
											$.extend(
												validator,
												validatorTemplate.init($this, el)
											)
										);
										foundValidator = true;
									}
								}
							);
						}
					} 
					
					if (! foundValidator) {
						$.error("Cannot find validation info for '" + el + "'");
					}
				});
				
				// =============================================================
				//                                         STORE FALLBACK VALUES
				// =============================================================

				// Keep the original contents of the help-block for when we 
				// need to reset back.
				$helpBlock.data(
					"original-contents", 
					(
						$helpBlock.data("original-contents") 
							? $helpBlock.data("original-contents") 
							: $helpBlock.html()
					)
				);

				// Keep the original classes to put back in case we are 
				// destroyed :(
				$controlGroup.data(
					"original-classes", 
					$controlGroup.attr("class")
				);
				
				// =============================================================
				//                                                    VALIDATION
				// =============================================================
				
				$this.bind(
					"validation.validation", 
					function (event, checkEmptyValues) {
						
						event = event; // not used
						
						var value = getValue($this);
						
						// Get a list of the errors to apply
						var errorsFound = [];

						if (value || value.length || checkEmptyValues) { // if its empty, reset.
							
							$.each(validators, function (validatorType, validatorTypeArray) {
								$.each(validatorTypeArray, function (i, validator) {
									if (settings.validatorTypes[validatorType].validate($this, value, validator)) {
										errorsFound.push(validator.message);
									}	
								});
							});
						}
						
						return errorsFound;
					}
				);
					
				$this.bind(
					"getValidators.validation",
					function (event) {
						event = event; // not used
						
						return validators;
					}
				);
					
				// =============================================================
				//                                             WATCH FOR CHANGES
				// =============================================================
				$this.bind(
					[
						"keyup",
						"focus",
						"blur",
						"click",
						"keydown",
						"keypress",
						"change"
					].join(".validation ") + ".validation", 
					function (e) {
						
						var value = getValue($this);
						
						var errorsFound = [];
						
						$controlGroup.find("input,textarea,select").each(function (i, el) {
							$.each($(el).triggerHandler("validation.validation"), function (j, message) {
								errorsFound.push(message);
							});
						});
						
						$form.find("input,select,textarea").not($this).not("[name=\"" + $this.attr("name") + "\"]").trigger("validationLostFocus.validation");
						
						errorsFound = $.unique(errorsFound);
					
						if (errorsFound.length) {
							$controlGroup.removeClass("success error").addClass("warning");
							$helpBlock.html("<ul><li>" + errorsFound.join("</li><li>") + "</li></ul>");
						} else {
							$controlGroup.removeClass("warning error success");
							if (value.length > 0) {
								$controlGroup.addClass("success");
							}
							$helpBlock.html($helpBlock.data("original-contents"));
						}

						if (e.type == "blur") {
							$controlGroup.removeClass("success");
						}
					}
				);
				$this.bind("validationLostFocus.validation", function () {
					$controlGroup.removeClass("success");
				});
			});
		},
		destroy : function( ) {

			return this.each(
				function() {

					var 
						$this = $(this),
						$controlGroup = $this.parents(".control-group").first(),
						$helpBlock = $controlGroup.find(".help-block").first();

					// remove our events
					$this.unbind('.validation'); // events are namespaced.
					// reset help text
					$helpBlock.html($helpBlock.data("original-contents"));
					// reset classes
					$controlGroup.attr("class", $controlGroup.data("original-classes"));

				}
			);

		}
	};

	$.fn.bootstrapValidation = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
		$.error( 'Method ' +  method + ' does not exist on jQuery.bootstrapValidation' );
			return null;
		}    

	};

})( jQuery );