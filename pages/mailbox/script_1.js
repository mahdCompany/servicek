page_script({
	init: function () {
		// process search form submit event

		var current_folder = [];

		$("[data-folder]").click(function (e, silent) {
			var folder = $(this).attr("data-folder");
			$.get(location.href, {refresh: folder}, function (rslt) {
				try {
					var parsed = JSON.parse(rslt);
					if(parsed.status="success"){
						var tbody = $(".messages-list tbody");
						tbody.empty();
						if(parsed.messages.length){
							current_folder = parsed.messages;
							for (var i = 0; i < parsed.messages.length; i++) {
								var tr = $("<tr>", {"data-id": i, "class": (parsed.messages[i].unread?"unread": "")}).append([
									$("<td>", {text: parsed.messages[i].subject}),
									$("<td>", {text: parsed.messages[i].from}),
									$("<td>", {text: parsed.messages[i].date}),
								]);
								tbody.append(tr);
							}
							$(".messages-list .empty-msg").hide();
							$(".messages-list table").show();
						}else{
							$(".messages-list .empty-msg").show();
							$(".messages-list table").hide();
						}
						if(!silent){
							$(".messages-list").show();
							$(".message-details").hide();
							$(".message-details iframe").attr("src", "");
						}
					}else console.log(rslt);
				} catch (e) {
					console.log(rslt);
				}
			});
		});

		$(".messages-list tbody tr").live("click", function() {
			var message = current_folder[$(this).attr("data-id")];
			$(".message-details").attr("data-id", message.id);
			$(".message-details .from").text(message.from);
			$(".message-details .to").text(message.to);
			$(".message-details .reply_to").text(message.reply_to);
			$(".message-details .subject").text(message.subject);
			$(".message-details .date").text(message.date);
			var att_list = $(".message-details .attachments .list");
			att_list.empty();
			if(message.attachments){
				for (var i = 0; i < message.attachments.length; i++) {
					att_list.append($("<a>", {"class": "btn btn-flat btn-lg", href: "messages/" + $(".folders .active a").attr("data-folder") + "/" + message.uid + "/" + i, html: '<i class="fa fa-download"></i> ' + message.attachments[i].name}));
				}
				$(".message-details .attachments").show();
			}else $(".message-details .attachments").hide();
			$(".message-details iframe").attr("src", "messages/" + $(".folders .active a").attr("data-folder") + "/" + message.uid);
			$(this).removeClass('unread');
			$(".messages-list").hide();
			$(".message-details").show();
		});

		$(".back_to_list").click(function () {
			$(".messages-list").show();
			$(".message-details").hide();
			$(".message-details iframe").attr("src", "");
		});

		$(".message-details .delete").click(function () {
			$.post(location.href, {remove_message: $(".message-details").attr("data-id"), folder: $(".folders .active a").attr("data-folder")}, function(rslt) {
				try{
          parsed=JSON.parse(rslt);
          if (parsed.status == "success") {
						$(".folders .active a").trigger("click");
					}else{
						console.log(rslt);
					}
				}catch(ex){
					console.log(rslt);
				}
			});
		});

		$(".message-details .reply").click(function () {
			$("#message_form [name=email]").val($(".message-details .reply_to").text().substring($(".message-details .reply_to").text().indexOf("<")+1,$(".message-details .reply_to").text().indexOf(">")) + ";");
			$("#message_form [name=subject]").val("Re: " + $(".message-details .subject").text());
			$("#message_modal").modal('show');
		});

		CKEDITOR.replace('message');
		CKEDITOR.instances.message.on('change', function() { CKEDITOR.instances.message.updateElement() });

		$("#message_form").ajaxForm({
			beforeSubmit: function () {
				$(".btn-loader", $("#message_modal")).show();
				$(".success_msg", $("#message_form")).hide();
				$(".unhandled_error", $("#message_form")).hide();
			},
			success: function (rslt) {
				$(".btn-loader", $("#message_modal")).hide();
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
		$("#message_modal").on("hide.bs.modal", function () {
			$("#message_form")[0].reset();
			$(".success_msg", $("#message_form")).hide();
			$(".unhandled_error", $("#message_form")).hide();
		});

		$(".folders .active a").trigger("click");
		setInterval(function () {
			$(".folders .active a").trigger("click", [true]);
		}, 60000);
	}
});
