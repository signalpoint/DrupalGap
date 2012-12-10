var user_picture_source;
var user_picture_destination_type;

$('#drupalgap_page_user_edit').on('pagebeforeshow',function(){
	try {
		$('#edit_picture').hide();
    }
	catch (error) {
		alert("drupalgap_page_user_edit - pagebeforeshow " + error);
	}
});

$('#drupalgap_page_user_edit').on('pageshow',function(){
	try {
		document.addEventListener("deviceready", user_edit_ready, false);
		drupalgap.services.user.retrieve.call({
			'uid':drupalgap.account.uid,
			'success':function(account){
				$('#name').val(account.name);
				$('#mail').val(account.mail);
				if (account.picture) {
					$('#edit_picture').attr('src', drupalgap_image_path(account.picture.uri)).show();
				}
			}
		});
    }
	catch (error) {
		alert("drupalgap_page_user_edit - pageshow " + error);
	}
});

$('#submit').on('click',function() {
	try {
		drupalgap.services.user.update.call({
			'account':{
				'uid':drupalgap.account.uid,
				'name':$('#name').val(),
				'current_pass':$('#current_pass').val(),
				'mail':$('#mail').val(),
			},
			'success':function(result) {
				$.mobile.changePage('user.html');
			}
		});
	}
	catch (error) {
	  alert("drupalgap_user_edit - submit - " + error);
	}
});

$('#add_picture').on("click",function(){
	photo_options = {
		quality: 50,
		destinationType: user_picture_destination_type.DATA_URL
	}
	navigator.camera.getPicture(user_edit_picture_success, user_edit_picture_error, photo_options);
});

function user_edit_ready() {
	user_picture_source = navigator.camera.PictureSourceType;
	user_picture_destination_type = navigator.camera.DestinationType;
}

function user_edit_picture_error(message) {
	alert(message);
}

function user_edit_picture_success(imageData) {
	var edit_picture = document.getElementById('edit_picture');
	edit_picture.src = "data:image/jpeg;base64," + imageData;
	edit_picture.onload = function () {
		// Resize it to fit a display (with 20px padding on both sides).
		ratio = this.width/$(window).width()-40;
		edit_picture.width = this.width/ratio;
		edit_picture.height = img_height/ratio;
	};
}
