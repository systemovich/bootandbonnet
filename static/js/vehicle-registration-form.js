/*jslint browser: true*/
/*global FileReader*/
/*global $*/

window.onload = function () {
	'use strict';
	var photoInputs, index, makesSelect, modelsSelect, removePhotoButtons;

	/**
	 * Fill the models select element with the models corresponding with the selected make.
	 */
	var fillModels = function () {
		var selectedMake = $('#makes').val();
		var makes = JSON.parse($('#manufacturers').val());
		for (var m in makes) {
			if (makes.hasOwnProperty(m) && (makes[m].name === selectedMake)) {
				for (var o in makes[m].models) {
					if (makes[m].models.hasOwnProperty(o)) {
						jQuery('<option/>', {
							text: makes[m].models[o].name
						}).appendTo('#models');
					}
				}
				break;
			}
		}
	};

	fillModels();

	$('#makes').change(function () {
		$('#models').html("<option selected='selected'>Please select ...</option>");
		fillModels();
	});

/* BUTTON GROUPS */

	/* Change button colours when toggled. */
	$('.bootandbonnet-yes-button').change(function () {
		$(this).closest('label').attr('class', 'btn btn-success').next().attr('class', 'btn btn-default');
	});

	$('.bootandbonnet-no-button').change(function () {
		$(this).closest('label').attr('class', 'btn btn-danger').prev().attr('class', 'btn btn-default');
	});

	/* Set the toggle states of toggle buttons. */
	/* jQuery has to be used here, because the button method is only available in jQuery. */
	if ($('#market').val() === 'new') {
		$('#marketNew').button('toggle');
	} else if ($('#market').val() === 'used') {
		$('#marketUsed').button('toggle');
	}

	if ($('#fullServiceHistory').val() === 'true') {
		$('#fullServiceHistoryYes').button('toggle');
	} else if ($('#fullServiceHistory').val() === 'false') {
		$('#fullServiceHistoryNo').button('toggle');
	}

	if ($('#absBrakes').val() === 'true') {
		$('#absBrakesYes').button('toggle');
	} else if ($('#absBrakes').val() === 'false') {
		$('#absBrakesNo').button('toggle');
	}

	if ($('#powerSteering').val() === 'true') {
		$('#powerSteeringYes').button('toggle');
	} else if ($('#powerSteering').val() === 'false') {
		$('#powerSteeringNo').button('toggle');
	}

	if ($('#airConditioning').val() === 'true') {
		$('#airConditioningYes').button('toggle');
	} else if ($('#airConditioning').val() === 'false') {
		$('#airConditioningNo').button('toggle');
	}

	if ($('#cdPlayer').val() === 'true') {
		$('#cdPlayerYes').button('toggle');
	} else if ($('#cdPlayer').val() === 'false') {
		$('#cdPlayerNo').button('toggle');
	}

	if ($('#radio').val() === 'true') {
		$('#radioYes').button('toggle');
	} else if ($('#radio').val() === 'false') {
		$('#radioNo').button('toggle');
	}

	if ($('#alarm').val() === 'true') {
		$('#alarmYes').button('toggle');
	} else if ($('#alarm').val() === 'false') {
		$('#alarmNo').button('toggle');
	}

	if ($('#centralLocking').val() === 'true') {
		$('#centralLockingYes').button('toggle');
	} else if ($('#centralLocking').val() === 'false') {
		$('#centralLockingNo').button('toggle');
	}

	if ($('#immobilizer').val() === 'true') {
		$('#immobilizerYes').button('toggle');
	} else if ($('#immobilizer').val() === 'false') {
		$('#immobilizerNo').button('toggle');
	}

	if ($('#gearLock').val() === 'true') {
		$('#gearLockYes').button('toggle');
	} else if ($('#gearLock').val() === 'false') {
		$('#gearLockNo').button('toggle');
	}

	if ($('#negotiable').val() === 'true') {
		$('#negotiableYes').button('toggle');
	} else if ($('#negotiable').val() === 'false') {
		$('#negotiableNo').button('toggle');
	}

/* THUMBNAILS */

	/* Change the appearance of input controls of type file, to look like normal Bootstrap buttons. */
	$('input[type=file]').bootstrapFileInput();
	$('.file-inputs').bootstrapFileInput();

	/* Store the links to the thumbnails in hidden fields. */
	$('.bootandbonnet-old-photo').val(function () {
		var imgName = $(this).attr('name').substring(3);
		return $('#'.concat(imgName)).attr('src');
	});

	/**
	 * @summary Displays thumbnails of photographs before uploading them.
	 *
	 * @param {object} input Input field of type files.
	 * @param {string} id Name of the input field.
	 *
	 * @returns {undefined}
	 */
	var readURL = function (input, id) {
		var reader;

		if (input.files && input.files[0]) {
			reader = new FileReader();

			$(reader).load(function (e) {
				$('#'.concat(id)).attr('src', e.target.result);
			});

			reader.readAsDataURL(input.files[0]);
		}
	};

	/* Selecting a photo for upload. */
	$('.bootandbonnet-input-file').change(function () {
		readURL(this, this.name);
		if ($(this).closest("hidden[name='deletedPhotos[]']").val() !== '') {
			$(this).closest("hidden[name='deletedPhotos[]']").val('');
		}
	});

	/* Cancelling a photo selected for upload. */
	$('.bootandbonnet-remove-file').click(function () {
		var inputName = $(this).attr('name').substring(3);
		var input = $("input[name='".concat(inputName).concat("']"));
		var isRemoveExistingPhoto = input.val() === '';
		if (!isRemoveExistingPhoto) {
			/* Clear the file-input field by wrapping a form around it, resetting the form, then unwrapping the form. */
			input.wrap('<form>').closest('form').get(0).reset();
			input.unwrap();
			/* Reset the thumbnail. */
			var oldPhoto = $("[name='".concat('old').concat(inputName).concat("']")).val();
			$('#'.concat(inputName)).attr('src', oldPhoto);
		} else {
			$('#'.concat(inputName)).attr('src', '/static/img/image-placeholder.png');
			var deletedPhotos = JSON.parse($("[name='deletedPhotos']").val());
			deletedPhotos.push($(this).attr('name').substr(-1));
			$("[name='deletedPhotos']").val(JSON.stringify(deletedPhotos));
		}

	});

/* CANCEL BUTTON */

	$('#cancelButton').click(function () {
		window.history.back();
	});
};