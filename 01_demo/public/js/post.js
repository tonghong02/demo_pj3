function post(){

	function blindEvent(){
		$(".post-edit").click(function(e){
			var params = {
				id: $(".id").val(),
				title: $(".title").val(),
				content: tinymce.get("content").getContent(),
				author: $(".author").val(),
			}

			tinymce.init({forced_root_block : "",selector:'textarea'});

			console.log(params);

			var baseUrl = location.protocol + "//" + document.domain + ":" + location.port;

			console.log(baseUrl);

			$.ajax({

				url : baseUrl + "/admin/post/edit",
				type: "PUT",
				data: params,
				dataType: "json",
				success: function(res){
					if(res && res.status_code == 200){
						location.reload();
					}
				}
			});

		});

		$(".post-delete").click(function(e){

			var postId = $(this).attr("post_id");

			var baseUrl = location.protocol + "//" + document.domain + ":" + location.port;

			$.ajax({

				url : baseUrl + "/admin/post/delete",
				type: "DELETE",
				data: {id: postId},
				dataType: "json",
				success: function(res){
					if(res && res.status_code == 200){
						location.reload();
					}
				}
			});


		})


	}

	blindEvent();



}

$(document).ready(function(){
	new post();
})