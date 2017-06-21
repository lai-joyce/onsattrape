var config = {
	apiKey: "AIzaSyDp8OOm78pBLJEKkE6r4JKBg_MPzqhiCVQ",
	authDomain: "onsattrape.firebaseapp.com",
	databaseURL: "https://onsattrape.firebaseio.com",
	projectId: "onsattrape",
	storageBucket: "onsattrape.appspot.com",
	messagingSenderId: "1094671185695"
};
firebase.initializeApp(config);

var uid = "-KmUZTaohwghpuagw";

var database = firebase.database();

var contactsRef = database.ref('users/'+uid+'/contacts');

$(document).on("click", "#importGoogleContacts", askForContactPermission);
$(document).on("click", "#selectAllCheckbox", selectAll);
$(document).on("click", "#saveButton", saveContactsToFirebase);

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

var provider = new firebase.auth.GoogleAuthProvider();

var user;
var token;



function expandModal() {
	$("#googleContactsSelector").modal();
}

// var falsy = false / null / "" / undefined / 0 ;

function displayGmailContacts(contactArray) {
	expandModal();

	var arrayLength = contactArray.length;
	for (var i = 0; i< arrayLength; i++ ) {
		if (contactArray[i].title.$t) {
			console.log(contactArray[i]);
			var tr = $('<tr class="gContact">')
			.append($('<td>')
				.append($('<input type="checkbox">')));
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