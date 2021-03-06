page_script({
	init: function () {

		CKEDITOR.replace('message');
		CKEDITOR.instances.message.on('change', function() { CKEDITOR.instances.message.updateElement() });

		$("#message_form").ajaxForm({
			beforeSubmit: function () {
				$(".btn-loader", $("#message_form")).show();
				$(".success_msg", $("#message_form")).hide();
				$(".unhandled_error", $("#message_form")).hide();
			},
			success: function (rslt) {
				$(".btn-loader", $("#message_form")).hide();
				try{
          parsed=JSON.parse(rslt);
          if (parsed.status == "success") {
          	$(".success_msg", $("#message_form")).show();
						$("#message_form")[0].reset();
      		} else {
          	console.log(rslt);
            $(".unhandled_error", $("#message_form")).show();
          }
	      }catch(ex){
	        console.log(rslt);
	        $(".unhandled_error", $("#message_form")).show();
	      }
			}
		});

		var myLatlng = new google.maps.LatLng(35.86384047540425, 10.544368078851221);
		var mapOptions = {
			scrollwheel: false,
		  	zoom: 13,
		  	center: myLatlng
		}
		var map = new google.maps.Map($("#contactmap")[0], mapOptions);
		var marker = new google.maps.Marker({
		    position: myLatlng
		});
		marker.setMap(map);
	}
});
