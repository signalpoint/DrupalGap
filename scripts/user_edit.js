var user_picture_source;
var user_picture_destination_type;
var user_picture_image_data;

$('#drupalgap_page_user_edit').on('pagebeforeshow',function(){
	try {
		// Init picture.
		user_picture_source = null;
		user_picture_destination_type = null;
		user_picture_image_data = null;
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
			'uid':drupalgap.account_edit.uid,
			'success':function(account){
				$('#name').val(account.name);
				if (account.mail) {
					$('#mail').val(account.mail);
				}
				else {
					$('#mail').hide();
					$('#current_pass').hide();
				}
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
		if (user_picture_image_data != null) {
			// Get image and create unique file name with current UTC val.
			var edit_picture = $('#edit_picture');
			var d = new Date();
			var image_file_name = "" + d.valueOf() + ".jpg";
			drupalgap.services.file.create.call({
				'file':{
					'file':user_picture_image_data,
					'filename':image_file_name,
					'filepath':'public://' + image_file_name
				},
				'success':function(file){
					drupalgap_user_edit_update({'file':{'fid':file.fid}});
				}
			});
		}
		else {
			drupalgap_user_edit_update(null);
		}
		
	}
	catch (error) {
	  alert("drupalgap_user_edit - submit - " + error);
	}
});

function drupalgap_user_edit_update(options) {
	var account = {
		'uid':drupalgap.account_edit.uid,
		'name':$('#name').val(),
		'current_pass':$('#current_pass').val(),
		'mail':$('#mail').val(),
	};
	if (options != null && options.file && options.file.fid) {
		account.picture = {'fid':options.file.fid};
	}
	drupalgap.services.user.update.call({
		'account':account,
		'success':function(result) {
			$.mobile.changePage('user.html');
		}
	});
}

$('#add_picture').on("click",function(){
	photo_options = {
		quality: 50,
		destinationType: user_picture_destination_type.DATA_URL,
		correctOrientation: true
	}
	navigator.camera.getPicture(user_edit_picture_success, user_edit_picture_error, photo_options);
});

function user_edit_ready() {
	user_picture_source = navigator.camera.PictureSourceType;
	user_picture_destination_type = navigator.camera.DestinationType;
}

function user_edit_picture_error(message) {
	alert('user_edit_picture_error - ' + message);
}

function user_edit_picture_success(imageData) {
	user_picture_image_data = imageData;
	var edit_picture = document.getElementById('edit_picture');
	edit_picture.src = "data:image/jpeg;base64," + user_picture_image_data;
	edit_picture.onload = function () {
		// Resize it to fit a display (with 20px padding on both sides).
		var ratio;
		if (this.width < this.height) { ratio = this.height/($(window).height()-40); }
		else { ratio = this.width/($(window).width()-40); }
		edit_picture.width = this.width/ratio;
		edit_picture.height = this.height/ratio;
		$('#edit_picture').show();
	};
}
