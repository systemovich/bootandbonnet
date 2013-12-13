window.onload = function() {
	'use strict';

	/**
	 * Sets the type of alert-span and the span content for the relevant control.
	 */
	var setValidationState = function (control, state, message) {
		var textNode = document.createTextNode(message);
		var spanElement = document.getElementById("span".concat(control));
		var divElement = document.getElementById("div".concat(control));
		divElement.className = "control-group ".concat(state);
		spanElement.textContent = "";
		spanElement.appendChild(textNode);
	};

	var emailBox = document.getElementById("email");

	emailBox.onblur = function () {
		setValidationState("Email", "", "");
	};

	var passwordBox = document.getElementById("password");
	var confirmPasswordBox = document.getElementById("confirmPassword");

	/**
	 * The data type of the value of every HTML element is string. It has to be
	 * converted to boolean.
	 */
	var isUserLoggedIn = document.getElementById("loggedIn").value === "true" ? true : false;

	/**
	 * If a user is logged-in, it means he/she is editing his/her profile, as opposed to a new
	 * user registering. When editing his/her profile, a user might not want to change the
	 * the password, in which case the passwordBox may be left blank.
	 */
	var isPasswordValid = function () {
		if (isUserLoggedIn) {
			return (passwordBox.value.length >= 10) || (passwordBox.value.length === 0);
		}
		return (passwordBox.value.length >= 10);
	};

	var isPasswordConfirmed = function () {
		return (passwordBox.value === confirmPasswordBox.value);
	};

	passwordBox.required = !isUserLoggedIn;
	confirmPasswordBox.required = !isUserLoggedIn;

	var confirmPasswordOnKeyUp = function() {
		if (!isPasswordValid()) {
			setValidationState("ConfirmPassword", "", "");
		} else if (!isPasswordConfirmed()) {
			setValidationState("ConfirmPassword", "info", "The passwords do not match yet.");
		} else {
			setValidationState("ConfirmPassword", "success", "The passwords match!");
		}
	};

	$('#password').on({
		focus:function() {
			if (!isPasswordValid()) {
				setValidationState("Password", "info", "Minimum ten characters.");
			}
		},
		keyup: function() {
			if (isPasswordValid()) {
				setValidationState("Password", "success", "Good!");
			} else {
				setValidationState("Password", "info", "Minimum ten characters.");
			}

			if (confirmPasswordBox.value.length > 0) {
				confirmPasswordOnKeyUp();
			}
		},
		blur: function() {
			if (passwordBox.value.length !== 0 && !isPasswordValid()) {
				setValidationState("Password", "error", "Too short! Minimum ten characters.");
			} else if (!isPasswordValid()) {
				setValidationState("Password", "", "");
			}
		}
	});

	$('#confirmPassword').on({
		focus: function() {
			if (!isPasswordValid() || confirmPasswordBox.value.length === 0) {
				setValidationState("ConfirmPassword", "", "");
			} else if (!isPasswordConfirmed()) {
				setValidationState("ConfirmPassword", "info", "The passwords do not match yet.");
			}
		},
		keyup: confirmPasswordOnKeyUp,
		blur: function() {
			if (!isPasswordValid()) {
				setValidationState("ConfirmPassword", "", "");
			} else if (!isPasswordConfirmed()) {
				setValidationState("ConfirmPassword", "error", "The passwords do not match!");
			}
		}
	});

	var isContactNumberProvided = function () {
		return ($('#telephone').val() !== "") || ($('#cellphone').val() !== "");
	};

	$('#telephone').on({
		focus: function () {
			setValidationState("Telephone", "info", "Use digits only, e.g. 0123456789.");
		},
		blur: function () {
			setValidationState("Telephone", "", "");
		}
	});

	$('#cellphone').on({
		focus: function () {
			setValidationState("Cellphone", "info", "Use digits only, e.g. 0834567819.");
		},
		blur: function () {
			setValidationState("Cellphone", "", "");
		}
	});
			
	var privateSellerOption = document.getElementById("privateSeller");
	var dealershipOption = document.getElementById("dealership");

	var isSellerTypeProvided = function () {
		return (privateSellerOption.checked || dealershipOption.checked);
	};

	/**
	 * The sellerType element is a hidden input element. Its value is an empty string
	 * when a new user registers.
	 */
	var sellerType = document.getElementById("sellerType").value;

	switch (sellerType) {
		case 'privateSeller':
			privateSellerOption.checked = true;
			break;
		case 'dealership':
			dealershipOption.checked = true;
			break;
	}

	var dealerOrLocationLegend = document.getElementById("dealerOrLocation");
	var leftColumn = document.getElementById("leftColumn");
	var rightColumn = document.getElementById("rightColumn");
	var provincesDiv = document.getElementById("provincesDiv");
	var townsDiv = document.getElementById("townsDiv");

	/**
	 * Show or hide the fields required for a dealership depending on the seller type.
	 */
	privateSellerOption.onchange = function() {
		if (this.checked) {
			dealerOrLocationLegend.textContent = "Location";
			document.getElementById("dealershipDetails").style.display = "none";
			document.getElementById("dealershipName").required = false;
			document.getElementById("streetAddress1").required = false;
			rightColumn.removeChild(provincesDiv);
			leftColumn.appendChild(provincesDiv);
		}
	};

	dealershipOption.onchange = function() {
		if (this.checked) {
			dealerOrLocationLegend.textContent = "Dealership Details";
			document.getElementById("dealershipDetails").style.display = "";
			document.getElementById("dealershipName").required = true;
			document.getElementById("streetAddress1").required = true;
			leftColumn.removeChild(provincesDiv);
			rightColumn.insertBefore(provincesDiv, townsDiv);
		}
	};

	var isProvinceProvided = function () {
		if ($('#provinces').val() === 'Please select ...') {
			return false;
		}
		return true;
	};

	var isTownProvided = function () {
		if ($('#towns').val() === 'Please select ...') {
			return false;
		}
		return true;
	};
	
	var provinces = JSON.parse($('#locations').val());
	/**
	 * Fills the #towns select element with the towns in the province selected in the #provinces
	 * select element.
	 */
	$('#provinces').change(function() {
		var currentProvince = $(this).val();
		var p, t;
		$('#towns').html('<option selected="selected">Please select ...</option>');
		for (p in provinces) {
			if (provinces[p].name === currentProvince) {
				for (t in provinces[p].towns) {
					jQuery('<option/>', {
						text: provinces[p].towns[t]
					}).appendTo('#towns');
				}
				break;
			}
		}
	});

	var cancelButton = document.getElementById("cancelButton");
	cancelButton.onclick = function() {
		window.history.back();
	};

	/* Showing and hiding alert messages. */
	var showContactNumbersAlert = function () {
		document.getElementById("contactNumbersAlert").style.display = "";
	};

	var hideContactNumbersAlert = function () {
		document.getElementById("contactNumbersAlert").style.display = "none";
	};

	var showSellerTypeAlert = function () {
		document.getElementById("sellerTypeAlert").style.display = "";
	};

	var hideSellerTypeAlert = function () {
		document.getElementById("sellerTypeAlert").style.display = "none";
	};

	var showLocationAlert = function () {
		document.getElementById("locationAlert").style.display = "";
	};

	var hideLocationAlert = function () {
		document.getElementById("locationAlert").style.display = "none";
	};

	var registrationForm = document.getElementById("register");
	/**
	 * Validate the form before submitting it. Display alert-spans for the required fields which
	 * were not completed or which were completed incorrectly.
	 */
	registrationForm.onsubmit = function() {
		if (!isPasswordValid() || !isPasswordConfirmed()) {
			return false;
		}

		if (!isContactNumberProvided()) {
			showContactNumbersAlert();
			return false;
		} else {
			hideContactNumbersAlert();
		}

		if (!isSellerTypeProvided()) {
			showSellerTypeAlert();
			return false;
		} else {
			hideSellerTypeAlert();
		}

		if (!isProvinceProvided() || !isTownProvided()) {
			showLocationAlert();
			return false;
		} else {
			hideLocationAlert();
		}

		return true;
	};
};