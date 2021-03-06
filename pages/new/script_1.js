page_script({
	init: function () {
		var current_form = $('#title' + $("input[name=type]:checked").val() +' form');

		$('input[name=type]').change(function(){
			switch ($("input[name=type]:checked").val()) {
				case "1":
					$('a[href="#title1"]').tab('show');
					current_form = $('#title1 form');
					var map = $("#job_geolocation").locationpicker("map");
					google.maps.event.trigger(map.map, 'resize');
					map.map.setCenter(map.marker.position);
				break;
				case "2":
					$('a[href="#title2"]').tab('show');
					current_form = $('#title3 form');
					var map = $("#shop_geolocation").locationpicker("map");
					google.maps.event.trigger(map.map, 'resize');
					map.map.setCenter(map.marker.position);
				break;
				case "3":
					$('a[href="#title3"]').tab('show');
					current_form = $('#title3 form');
					var map = $("#company_geolocation").locationpicker("map");
					google.maps.event.trigger(map.map, 'resize');
					map.map.setCenter(map.marker.position);
				break;
			}

		});

		$("#job_submit_form input[name=name]").change(function(event) {
			if(!$("#job_submit_form input[name=url]").val()){
					$("#job_submit_form input[name=url]").val($(this).val()).trigger('change');
			}
		});
		$("#shop_submit_form input[name=name]").change(function(event) {
			if(!$("#shop_submit_form input[name=url]").val()){
					$("#shop_submit_form input[name=url]").val($(this).val()).trigger('change');
			}
		});
		$("#company_submit_form input[name=name]").change(function(event) {
			if(!$("#company_submit_form input[name=url]").val()){
					$("#company_submit_form input[name=url]").val($(this).val()).trigger('change');
			}
		});

		$("#job_submit_form input[name=url]").change(function(event) {
			$.post(location.href, { pick_url: $(this).val() }, function(rslt) {
				$("#job_submit_form input[name=url]").val(rslt);
				$("#job_submit_form .url-help .web").text(rslt);
				$("#job_submit_form .url-help .mail").text(rslt);
				if(rslt) $("#job_submit_form .url-help").show();
				else $("#job_submit_form .url-help").hide();
			});
		});
		$("#shop_submit_form input[name=url]").change(function(event) {
			$.post(location.href, { pick_url: $(this).val() }, function(rslt) {
				$("#shop_submit_form input[name=url]").val(rslt);
				$("#shop_submit_form.url-help .web").text(rslt);
				$("#shop_submit_form.url-help .mail").text(rslt);
				if(rslt) $("#shop_submit_form .url-help").show();
				else $("#shop_submit_form .url-help").hide();
			});
		});
		$("#company_submit_form input[name=url]").change(function(event) {
			$.post(location.href, { pick_url: $(this).val() }, function(rslt) {
				$("#company_submit_form input[name=url]").val(rslt);
				$("#company_submit_form .url-help .web").text(rslt);
				$("#company_submit_form .url-help .mail").text(rslt);
				if(rslt) $("#company_submit_form .url-help").show();
				else $("#company_submit_form .url-help").hide();
			});
		});

		// register_form

		$("#register_form input[name=username]").change(function () {
			var input = $(this);

			$('.icon-check, .icon-ban, .icon-close', input.closest('.form-group')).remove();
			if (input.val() === "") {
				input.closest('.form-group').removeClass('has-error').removeClass('has-success');
				return;
			}

			input.attr("readonly", true).
			attr("disabled", true).
			addClass("spinner");
			$("#username_unvailable_msg").hide();
			$("#username_error_msg").hide();

			$.post($("#register_form").attr("action"), { check_username: input.val() }, function (res) {
				input.attr("readonly", false).
				attr("disabled", false).
				removeClass("spinner");

				if (res.status == 'available') {
					$('.icon-ban', input.closest('.form-group')).remove();
					input.closest('.form-group').removeClass('has-error').removeClass('has-success');
				} else if (res.status == 'not_available') {
					input.closest('.form-group').removeClass('has-success').addClass('has-error');
					$('.fa-check', input.closest('.form-group')).remove();
					input.before('<i class="icon-ban"></i>');
					$("#username_unvailable_msg").show();
					input.focus();
				}else{
					console.log(res);
					input.closest('.form-group').removeClass('has-success').addClass('has-error');
					$('.fa-check', input.closest('.form-group')).remove();
					input.before('<i class="icon-close"></i>');
					$("#username_error_msg").show();
					$("#username_error_msg a").focus();
				}

			}, 'json')
			.fail(function(err) {
				console.log(err);
				input.closest('.form-group').removeClass('has-success').addClass('has-error');
				$('.fa-check', input.closest('.form-group')).remove();
				input.before('<i class="icon-close"></i>');
				$("#username_error_msg").show();
				$("#username_error_msg a").focus();
			});

		});

		var check_password_confirmation = function () {
			var input = $("#register_form input[name=password]");
			if($("#register_form input[name=password]").val().length < 8){
				input.closest('.form-group').removeClass('has-success').addClass('has-error');
				$('.fa-check', input.closest('.form-group')).remove();
				input.before('<i class="icon-ban"></i>');
				$("#password_min_length_error").show();
				input.focus();
			}else{
				$('.icon-ban', input.closest('.form-group')).remove();
				input.closest('.form-group').removeClass('has-error').removeClass('has-success');
				$("#password_min_length_error").hide();
			}

			var input = $("#password_confirmation");
			if($("#password_confirmation").val() == "" || $("#password_confirmation").val() == $("#register_form input[name=password]").val()){
				$('.icon-ban', input.closest('.form-group')).remove();
				input.closest('.form-group').removeClass('has-error').removeClass('has-success');
				$("#passwords_not_match").hide();
			}else{
				input.closest('.form-group').removeClass('has-success').addClass('has-error');
				$('.fa-check', $("#password_confirmation").closest('.form-group')).remove();
				input.before('<i class="icon-ban"></i>');
				$("#passwords_not_match").show();
				$("#password_confirmation").focus();
			}
		};

		$("#register_form input[name=password]").change(check_password_confirmation);
		$("#password_confirmation").change(check_password_confirmation);

		$("#register_form input[name=email]").change(function(e) {
			$("#job_submit_form input[name=email]").val($(this).val());
			$("#shop_submit_form input[name=email]").val($(this).val());
			$("#company_submit_form input[name=email]").val($(this).val());
		});

		$("#register_form input[name=mobile]").change(function(e) {
			$("#job_submit_form input[name=mobile]").val($(this).val());
			$("#shop_submit_form input[name=mobile]").val($(this).val());
			$("#company_submit_form input[name=mobile]").val($(this).val());
		});

		$("#register_form input[name=email]").inputmask({
      mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
      greedy: false,
      onBeforePaste: function (pastedValue, opts) {
        pastedValue = pastedValue.toLowerCase();
        return pastedValue.replace("mailto:", "");
      },
      definitions: {
        '*': {
          validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
          cardinality: 1,
          casing: "lower"
        }
      }
    });
		$("#register_form input[name=mobile]").inputmask({ "mask": "9", "repeat": 25, "greedy": false });

		$("#register_form").ajaxForm({
			beforeSubmit: function () {
				if($("#password_confirmation").val() != $("#register_form input[name=password]").val()) return false;
			},
			success: function (rslt) {
				try{
					parsed=JSON.parse(rslt);
					if ( parsed.status == "logged_in" ) {
						$(".top-menu .user-btn .username").text(parsed.params.displayname);
						$(".top-menu .login-btn").hide();
						$(".top-menu .user-btn").show();
						$("#register_form").remove();
						current_form.submit();
					}else if ( parsed.status == "registered" ) {
						$("input[name=user_id]").val(parsed.params.user_id);
						$("#register_form").remove();
						current_form.submit();
					} else if (parsed.status == 'username_exists') {
						var input = $("#register_form input[name=username]");
						input.closest('.form-group').removeClass('has-success').addClass('has-error');
						$('.fa-check', input.closest('.form-group')).remove();
						input.before('<i class="icon-ban"></i>');
						$("#username_unvailable_msg").show();
						input.focus();
					} else if (parsed.status == 'password_min_length_error') {
						var input = $("#register_form input[name=password]");
						input.closest('.form-group').removeClass('has-success').addClass('has-error');
						$('.fa-check', input.closest('.form-group')).remove();
						input.before('<i class="icon-ban"></i>');
						$("#password_min_length_error").show();
						input.focus();
					} else {
						console.log(rslt);
						$(".unhandled_error").show();
					}

				}catch(ex){
					console.log(ex);
					console.log(rslt);
					$(".unhandled_error").show();
				}

			},
			error: function () {
				console.log(rslt);
				$(".unhandled_error").show();
			}
		});

		// NEW JOB Start
		// handling geolocation picker

		if(!navigator.geolocation){
			var main = $("#job_find_my_position").parents(".input-group");
			main.before($("input",main));
			main.remove();
		}

		$('#job_geolocation').locationpicker({
			location: {latitude: 33.881967, longitude: 9.560764},
			radius: 0,
			zoom: 6,
			enableAutocomplete: true,
			scrollwheel: false,
			inputBinding: {
				locationNameInput: $('#job_submit_form [name=address]'),
				latitudeInput: $('#job_submit_form [name=latitude]'),
				longitudeInput: $('#job_submit_form [name=longitude]')
			}
		});
		$("#job_find_my_position").click(function (e) {
			e.preventDefault();
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					$('#job_submit_form [name=latitude]').val(position.coords.latitude).change();
					$('#job_submit_form [name=longitude]').val(position.coords.longitude).change();
				});
			}
		});


		// handling wizard
		var job_form = $('#job_submit_form');
		var error = $('.alert-danger.form-error');

		var formvalidator = job_form.validate({
			ignore: "",
			errorElement: 'span',
			errorClass: 'help-block help-block-error',
			focusInvalid: true,
			rules: {

				name: {minlength: 3, maxlength: 255, required: true},
				description: {minlength: 50, maxlength: 4095, required: true},
				categories: {required: true},
				url: {
					minlength: 5,
					remote: {
						url: $("#job_submit_form").attr("action"),
						type: "post",
						data: {
							check_url: function() {
								return $("[name=url]",job_form).val();
							}
						}
					}
				},
				address: {required: true},
				longitude: {required: true},
				latitude: {required: true}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				error.show();
			},

			highlight: function (element) { // hightlight error inputs
				$(element)
					.closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				$(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {

			},
			errorPlacement: function (error, element) {

				switch($(element).attr("job_name")){
					default:
						error.insertAfter(element);
					break;
				}
			},
			submitHandler: function (job_form) {
				error.hide();
			}

		});

		$("[name='categories[]']", job_form).select2();

		job_form.submit(function (e){
			if(!job_form.valid()) {
				e.preventDefault();
				return false;
			}
			if(e.originalEvent && $("#register_form").length==1){
				$("#register_form").submit();
				e.preventDefault();
				return false;
			}
			$.ajax({
				url: $(this).attr("action"),
				type: "POST",
				data: $(job_form).serialize(),
				success: function (rslt) {
					try{
						p=JSON.parse(rslt);
						switch(p.status){
							case "success":
								app.ajaxify(p.params.job_url);
							break;
							default:
								console.log(p);
								return false;
							break;
						}
					}catch(ex){
						console.log(rslt);
						return false;
					}
				},
				error: function (rslt) {
					console.log(rslt);
					return false;
				}
			});
		});

		// NEW JOB End

		// NEW COMPANY Start
		// handling geolocation picker

		if(!navigator.geolocation){
			var main = $("#company_find_my_position").parents(".input-group");
			main.before($("input",main));
			main.remove();
		}

		$('#company_geolocation').locationpicker({
			location: {latitude: 33.881967, longitude: 9.560764},
			radius: 0,
			zoom: 6,
			enableAutocomplete: true,
			scrollwheel: false,
			inputBinding: {
				locationNameInput: $('#company_submit_form [name=address]'),
				latitudeInput: $('#company_submit_form [name=latitude]'),
				longitudeInput: $('#company_submit_form [name=longitude]')
			}
		});
		$("#company_find_my_position").click(function (e) {
			e.preventDefault();
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					$('#company_submit_form [name=latitude]').val(position.coords.latitude).change();
					$('#company_submit_form [name=longitude]').val(position.coords.longitude).change();
				});
			}
		});

		// handling wizard
		var company_form = $('#company_submit_form');
		var error = $('.alert-danger.form-error');

		var formvalidator = company_form.validate({
			ignore: "",
			errorElement: 'span',
			errorClass: 'help-block help-block-error',
			focusInvalid: true,
			rules: {

				name: {minlength: 3, maxlength: 255, required: true},
				description: {minlength: 50, maxlength: 4095, required: true},
				categories: {required: true},
				url: {
					minlength: 5,
					remote: {
						url: $("#company_submit_form").attr("action"),
						type: "post",
						data: {
							check_url: function() {
								return $("[name=url]",company_form).val();
							}
						}
					}
				},

				address: {required: true},
				longitude: {required: true},
				latitude: {required: true}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				error.show();
			},

			highlight: function (element) { // hightlight error inputs
				$(element)
					.closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				$(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {

			},
			errorPlacement: function (error, element) {

				switch($(element).attr("company_name")){
					case "url":
						error.appendTo($(element.parents(".form-group")[0]).find(".error_msg"));
					break;
					default:
						error.insertAfter(element);
					break;
				}
			},
			submitHandler: function (company_form) {
				error.hide();
			}

		});

		$("[name='categories[]']", company_form).select2();

		company_form.submit(function (e){
			if(!company_form.valid()){
				e.preventDefault();
				return false;
			}
			if(e.originalEvent && $("#register_form").length==1){
				$("#register_form").submit();
				e.preventDefault();
				return false;
			}
			$.ajax({
				url: $(this).attr("action"),
				type: "POST",
				data: $(company_form).serialize(),
				success: function (rslt) {
					try{
						p=JSON.parse(rslt);
						switch(p.status){
							case "success":
								app.ajaxify(p.params.company_url);
							break;
							default:
								console.log(p);
								return false;
							break;
						}
					}catch(ex){
						console.log(rslt);
						return false;
					}
				},
				error: function (rslt) {
					console.log(rslt);
					return false;
				}
			});
		});
		// NEW COMPANY End

		// NEW shop Start
		// handling geolocation picker

		if(!navigator.geolocation){
			var main = $("#shop_find_my_position").parents(".input-group");
			main.before($("input",main));
			main.remove();
		}

		$('#shop_geolocation').locationpicker({
			location: {latitude: 33.881967, longitude: 9.560764},
			radius: 0,
			zoom: 6,
			enableAutocomplete: true,
			scrollwheel: false,
			inputBinding: {
				locationNameInput: $('#shop_submit_form [name=address]'),
				latitudeInput: $('#shop_submit_form [name=latitude]'),
				longitudeInput: $('#shop_submit_form [name=longitude]')
			}
		});
		$("#shop_find_my_position").click(function (e) {
			e.preventDefault();
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function (position) {
					$('#shop_submit_form [name=latitude]').val(position.coords.latitude).change();
					$('#shop_submit_form [name=longitude]').val(position.coords.longitude).change();
				});
			}
		});

		// handling wizard
		var shop_form = $('#shop_submit_form');
		var error = $('.alert-danger.form-error');

		var formvalidator = shop_form.validate({
			ignore: "",
			errorElement: 'span',
			errorClass: 'help-block help-block-error',
			focusInvalid: true,
			rules: {

				name: {minlength: 3, maxlength: 255, required: true},
				description: {minlength: 50, maxlength: 4095, required: true},
				categories: {required: true},
				url: {
					minlength: 5,
					remote: {
						url: $("#shop_submit_form").attr("action"),
						type: "post",
						data: {
							check_url: function() {
								return $("[name=url]",shop_form).val();
							}
						}
					}
				},

				address: {required: true},
				longitude: {required: true},
				latitude: {required: true}
			},

			invalidHandler: function (event, validator) { //display error alert on form submit
				error.show();
			},

			highlight: function (element) { // hightlight error inputs
				$(element)
					.closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
			},

			unhighlight: function (element) { // revert the change done by hightlight
				$(element)
					.closest('.form-group').removeClass('has-error'); // set error class to the control group
			},

			success: function (label) {

			},
			errorPlacement: function (error, element) {

				switch($(element).attr("shop_name")){
					case "url":
						error.appendTo($(element.parents(".form-group")[0]).find(".error_msg"));
					break;
					default:
						error.insertAfter(element);
					break;
				}
			},
			submitHandler: function (shop_form) {
				error.hide();
			}

		});

		$("[name='categories[]']", shop_form).select2();

		shop_form.submit(function (e){
			if(!shop_form.valid()){
				e.preventDefault();
				return false;
			}
			if(e.originalEvent && $("#register_form").length==1){
				$("#register_form").submit();
				e.preventDefault();
				return false;
			}
			$.ajax({
				url: $(this).attr("action"),
				type: "POST",
				data: $(shop_form).serialize(),
				success: function (rslt) {
					try{
						p=JSON.parse(rslt);
						switch(p.status){
							case "success":
								app.ajaxify(p.params.shop_url);
							break;
							default:
								console.log(p);
								return false;
							break;
						}
					}catch(ex){
						console.log(rslt);
						return false;
					}
				},
				error: function (rslt) {
					console.log(rslt);
					return false;
				}
			});
		});
		// NEW shop End

		$("#register_form input[name=displayname]").focus();

	}
});
