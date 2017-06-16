// alert("working");
// now = moment();
// 	console.log(now);
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

contactsRef.on("child_added", function(snapshot) {
	if (selectionLogic(snapshot.val())>0) {
		//console.log(snapshot.val().name);
		var mainDiv = $("<div>");
		mainDiv.addClass("col-md-4");
		mainDiv.addClass("mainDiv");

		var divPanel = $("<div>");
		divPanel.addClass("panel panel-info contact-panel");

		var panelHeading = $("<div>");
		panelHeading.addClass("panel-heading clearfix");

		var panelTitle = $("<div>").addClass('panelTitle pull-left').text(snapshot.val().name);

		var panelHeadingIcons = $("<div>").addClass('pull-right');		

		// var imageHolder = $("<img>");
		// imageHolder.attr("src", "#");
		// panelHeading.append(imageHolder);

		

		$("#dump-div").append(mainDiv);


		var panelBody = $("<div>");
		panelBody.addClass("panel-body hidden-sm hidden-xs");

		var notes = $("<p>");
		notes.attr("id", "notesParagraph");
		notes.append("<h4>" + " Last time talked about: " + snapshot.val().lastTalked + "</h4>");

		if (snapshot.val().birthday !== null && snapshot.val().birthday !== "") {
			notes.append("<h5>" + " Birthday is on: " + snapshot.val().birthday + "</h5>");
		}

		if (snapshot.val().city !== null && snapshot.val().city !== "") {
			notes.append("<h6>" + " Located currently in: " + snapshot.val().city + "</h6>");
		}

		panelBody.append(notes);

		var check = $("<a>");
		check.addClass("checkMark btn btn-primary panelButton");
		var icheck = $("<i>");
		icheck.addClass("fa fa-check");
		icheck.attr("aria-hidden", "true");
		check.append(icheck);

		if (snapshot.val().phone !== null) {
			var phone = $("<a>");
			phone.attr("href", "tel:" + snapshot.val().telephone);
			phone.attr("id", "phoneLine");
			phone.addClass("btn btn-primary panelButton");
			var iphone = $("<i>");
			iphone.addClass("fa fa-phone");
			iphone.attr("aria-hidden", "true");
			phone.append(iphone);
			panelHeadingIcons.append(phone);
		}

		if (snapshot.val().email !== null) {

			var email = $("<a>");
			email.attr("href", "mailto:" + snapshot.val().email);
			email.addClass("btn btn-primary panelButton hidden-md hidden-lg");
			var iemail = $("<i>");
			iemail.addClass("fa fa-envelope-o");
			iemail.attr("aria-hidden", "true");
			email.append(iemail);

			var gmail = $("<a>");
			gmail.attr("href", "https://mail.google.com/mail/?view=cm&fs=1&to=" + snapshot.val().email);
			gmail.attr("target", "_blank");
			gmail.attr("id", "gmailID");
			gmail.addClass("btn btn-primary panelButton hidden-sm hidden-xs");
			var igemail = $("<i>");
			igemail.addClass("fa fa-envelope-o");
			igemail.attr("aria-hidden", "true");
			//igemail.text("g");
			gmail.append(igemail);

			panelHeadingIcons.append(email);
			panelHeadingIcons.append(gmail);

		}

		panelHeadingIcons.append(check);


		var viewNotes = $("<a>");
		//check.attr("href", "#");
		viewNotes.addClass("checkMark btn btn-primary");
		var iNotes = $("<i>");
		iNotes.addClass("fa");
		//iNotes.addClass("fa-check");
		iNotes.attr("aria-hidden", "true");
		iNotes.text("View Notes");
		viewNotes.append(iNotes);

		panelBody.append(viewNotes);

		panelHeading.append(panelTitle);
		panelHeading.append(panelHeadingIcons);

		divPanel.append(panelHeading);

		divPanel.append(panelBody);

		mainDiv.append(divPanel);

		$("#dump-div").append(mainDiv);
	}


});

var now;
var myrng;
var myrngInt;
var todayStr;
var minThreshold;
var maxThreshold;

function setUpLogic() {
	//Gets today's date
	now = moment();
	todayStr = now.format('YYYY-MM-DD');
	//Sets random number based on date
	myrng = new Math.seedrandom(todayStr);
	myrngInt = Math.floor(myrng()*1000000+1);
	//Grabs constants/user settings for minThreshold and maxThreshold
	var infoRef = database.ref('users/'+uid+'/info');
	infoRef.on("value", function(snap) {
		if (snap.val() !== null && (snap.val().minThreshold < 0.5 && snap.val().minThreshold >= 0)) {
			minThreshold = snap.val().minThreshold;
		} else {
			minThreshold = 0.25;
		}
		if (snap.val() !== null && snap.val().maxThreshold >= 1.5) {
			maxThreshold = snap.val().maxThreshold;
		} else {
			maxThreshold = 2;
		}
	});
}

setUpLogic();

function selectionLogic(snapValues) {

	now = moment();
	todayStr = now.format('YYYY-MM-DD');
	console.log(now);
	var birthdayContactsGroup1 = [];
	var proximityContactsGroup2 = [];
	var randomContactsGroup3 = [];
	var milesFromContactCity;

	var contactBirthday = database.ref('users/'+uid+'/contacts');

	contactBirthday.on("value", function(snapshot) {
		console.log(snapshot);
		if (snapshot.val().birthday !== now) {
			birthdayContactsGroup1.push(snapshot.val().contact);
			return 1;

		}
		//use Google Maps API to figure out distance between Contact and User City?
		if (snapshot.val().city.milesFromContactCity <= 25) {
			proximityContactsGroup2.push(snapshot.val().contact);
			return 2;
		}

		if ((myrng + contact.myrngInt) % snapshot.val().lastTalked === 0) {
			randomContactsGroup3.push(snapshot.val().contact);
			return 3;
		}
		
	});

	for(var item in birthdayContactsGroup1) {
				var contactsByBirthday = $("<div>" + birthdayContactsGroup1[item] + "</div>");
				$("#dump-div").append(contactsByBirthday);
			};
	//This is where the magic happens; this function should return why someone was selected (birthday = 1, location = 2, random = 3)
}




// var randNum = random number from date
// //This should be the same every time it's run on a specific date, in case we need to recreate it. It should be the same across all our users as well

// //loop (in Bob's code): 
// for each contact {
// 	if (checkEligibility(contact) {
// 		populate page
// 	}
// }

// $(document).ready(function() {


// function checkEligibility (contact) {

// 	   var birthday = 0;
//        var location = 0;
//        var offset = 0;
//        var frequency = $("#frequency");
//        var randNum = Math.floor(Math.random() * 1000000);
//        var contacts_to_daily = [];
//        for (var i=0; i<4; i++) {
//         contacts_to_daily.push();
//        }
// 	//Bday check
// 	if (contact.bday === today) {
// 		return 1;
// 	}

//        } 
// 	return false;
// }

$(document).on("click",".checkMark", removeDiv);

function removeDiv() {


	//console.log("something");
	//$(this).parent().parent().parent().remove();
// 	$("#dump-div").empty();
var key = $(this).parent().parent().parent().data('key');
addNote(key);
mostRecentContact(key);
	//createNewModal();
	
}

function addNote(key) {
	console.log(key.notes);
	contactsRef.child(key).child('notes').push({
		date: '2017-06-14'
	})
}

function mostRecentContact(key) {
	contactsRef.child(key).update({
		lastTalked: '2017-06-14'
	})
}



function createNewModal() {

}
