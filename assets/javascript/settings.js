var config = {
	apiKey: "AIzaSyDp8OOm78pBLJEKkE6r4JKBg_MPzqhiCVQ",
	authDomain: "onsattrape.firebaseapp.com",
	databaseURL: "https://onsattrape.firebaseio.com",
	projectId: "onsattrape",
	storageBucket: "onsattrape.appspot.com",
	messagingSenderId: "1094671185695"
};
firebase.initializeApp(config);

var provider = new firebase.auth.GoogleAuthProvider();
var database = firebase.database();
var user;
var token;
var contactsRef;
var infoRef;
var uid;

firebase.auth().onAuthStateChanged(function(fbUser) {
	if (fbUser) {
		user = fbUser;
		console.log(fbUser);
		uid = user.uid;
		contactsRef = database.ref('users/'+uid+'/contacts');
		infoRef = database.ref('users/'+uid+'/info');
		populateInfoRef();
	}
	else {
		window.location.href = 'auth.html';
	}
});

function populateInfoRef() {
	infoRef.on("value", function(snap) {
		console.log(snap.val());
		$('#minThreshold').val(snap.val().minThreshold || 0.25);
		$('#maxThreshold').val(snap.val().maxThreshold || 2);
		$('#maxDistance').val(snap.val().maxDistance || 25);
		$('#nameInput').val(snap.val().name);
		$('#emailInput').val(snap.val().email);
	});
}

$(document).on("click", "#importGoogleContacts", askForContactPermission);
$(document).on("click", "#selectAllCheckbox", selectAll);
$(document).on("click", "#saveButton", saveContactsToFirebase);
$(document).on("click", "#saveUserInfo", saveUserInfo);
$(document).on("click", "#saveLogic", saveLogic);
$(document).on("click", "#signOut", signOut);
$(document).on("change", ".includeCheckbox", function () {
	geoTagRow($(this));
});

function geoTagRow(checkbox) {
	//console.log(checkbox);
	var row = checkbox.parents(".gContact")
	var city = row.find("#locationInput").text();
	if(city) {
		//getLatLong(city, row);
	}
}

function getLatLong (city, row) {
	var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+"&key=AIzaSyBa98pCggkp_lKy9w2FkWXJTWoDIJNoI9c";
	$.ajax({
		url: queryURL, 
		method: "GET",
		dataType: 'JSON',
		crossOrigin: true,
	}).done(function(response) {
		row.data('lat', response.results[0].geometry.location.lat);
		row.data('long', response.results[0].geometry.location.lng);
	});

}

function saveLogic() {
	if (validateLogicInputs()) {
		infoRef.update({
			maxDistance: Number($('#maxDistance').val().trim()),
			minThreshold: Number($('#minThreshold').val().trim()),
			maxThreshold: Number($('#maxThreshold').val().trim()),
		});
	}
}

function validateLogicInputs () {
	if(!($("#maxDistance").val().trim() > 0)) {
		$("#maxDistance").focus().parent().addClass('has-error').append($('<small>').text("Must be a number greater than 0"));
		return false;
	}
	if(!($("#minThreshold").val().trim() >= 0 && $("#minThreshold").val().trim() < 1)) {
		$("#minThreshold").focus().parent().addClass('has-error').append($('<small>').text("Must be a number between 0 & 1"));
		return false;
	}
	if(!($("#maxThreshold").val().trim() >= 1)) {
		$("#maxThreshold").focus().parent().addClass('has-error').append($('<small>').text("Must be a number greater than 1"));
		return false;
	}
	return true;
}

function saveUserInfo() {
	if (validateLogicInputs()) {
		infoRef.update({
			name: $('#nameInput').val().trim(),
			email: $('#emailInput').val().trim()
		});
	}
}

function validateUserInputs () {
	return true;
}

function saveContactsToFirebase() {
	$("tr.gContact").each(function() {
		if($(this).find("input[type='checkbox']").is(':checked')) {
			contactsRef.push({
				name: $(this).children("#nameInput").data('fullName').trim(),
				telephone: $(this).children("#telephoneInput").text().trim(),
				email: $(this).children("#emailInput").data('fullEmail').trim(),
				city: $(this).children("#locationInput").text().trim(),
				days: Number($(this).find("#daysBetweenInput").val().trim()),
				offset: Math.floor(Math.random()*1000000+1)
			})
		}
	});
	$('#googleContactsSelector').modal('hide');
}



function selectAll() { 
	if ($(this).is(':checked')){
		$("input[type='checkbox']").prop('checked', true).change();
	} else {
		$("input[type='checkbox']").prop('checked', false).change();
	}
}



function expandModal() {
	$("#googleContactsSelector").modal();
}

// var falsy = false / null / "" / undefined / 0 ;

function displayGmailContacts(contactArray) {
	expandModal();

	var arrayLength = contactArray.length;
	for (var i = 0; i< arrayLength; i++ ) {
		if (contactArray[i].title.$t) {
			//console.log(contactArray[i]);
			var tr = $('<tr class="gContact">')
			.append($('<td>')
				.append($('<input type="checkbox" class="includeCheckbox">')));
			tr.append($('<td id="nameInput">')
				.data('fullName',contactArray[i].title.$t)
				.text(contactArray[i].title.$t.substring(0,30)+((contactArray[i].title.$t.length > 30) ? "..." : "")));
			if(contactArray[i].gd$phoneNumber){
				tr.append($('<td id="telephoneInput">').text(contactArray[i].gd$phoneNumber["0"].$t));
			} else {
				tr.append($('<td id="telephoneInput">'));
			}
			if(contactArray[i].gd$email){
				tr.append($('<td id="emailInput">')
					.data('fullEmail',contactArray[i].gd$email["0"].address)
					.text(contactArray[i].gd$email["0"].address.substring(0,30)+((contactArray[i].gd$email["0"].address.length > 30) ? "..." : "")));
			} else {
				tr.append($('<td id="emailInput">'));
			}
			if(contactArray[i].gd$postalAddress){
				var address = parseAddress.parseLocation(contactArray[i].gd$postalAddress["0"].$t);
				tr.append($('<td id="locationInput">').text(address.city+", "+address.state));
			} else {
				tr.append($('<td id="locationInput">'));
			}
			tr.append($('<td>').append($('<select class="form-control daysBetweenInput" id="daysBetweenInput"><option>1</option><option>2</option><option>3</option><option>7</option><option>14</option><option>28</option><option>90</option><option>180</option><option>365</option></select>').val(7)));
			$('#contactTable').append(tr);
		}
	}
}

// give me the permission to access the contacts
function askForContactPermission() {
	provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
	provider.addScope('https://www.google.com/m8/feeds/');
	firebase.auth().signInWithPopup(provider).then(function(result) {
		token = result.credential.accessToken;
		user = result.user;
		grabContacts();
	}).catch(function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		var email = error.email;
		var credential = error.credential;
	});
}

function grabContacts() {
	$.ajax({ 
		url: "https://www.google.com/m8/feeds/contacts/" + user.email +"/full?access_token=" + token + "&alt=json&max-results=9999", 
		dataType: "JSONP", 
		success: function(res){ 
			//console.log(res.feed.entry);
			displayGmailContacts(res.feed.entry);
		}, 
		error: function(xhr,status,error){
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
	});
}

function signOut() {
	firebase.auth().signOut().then(function() {
		window.location.href = 'auth.html';
	}).catch(function(error) {
	});
}