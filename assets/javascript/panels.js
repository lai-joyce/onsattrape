$(function() {

	var config = {
		apiKey: "AIzaSyDp8OOm78pBLJEKkE6r4JKBg_MPzqhiCVQ",
		authDomain: "onsattrape.firebaseapp.com",
		databaseURL: "https://onsattrape.firebaseio.com",
		projectId: "onsattrape",
		storageBucket: "onsattrape.appspot.com",
		messagingSenderId: "1094671185695"
	};

	firebase.initializeApp(config);

	//Firebase global variables
	var provider = new firebase.auth.GoogleAuthProvider();
	var database = firebase.database();
	var user;
	var token;
	var contactsRef;
	var infoRef;
	var uid;

	//Checks to see if user is logged in, tosses them to auth page if not. If file is locally hosted, assigns our test account
	firebase.auth().onAuthStateChanged(function(fbUser) {
		if (fbUser) {
			user = fbUser;
			console.log(fbUser);
			uid = user.uid;
		}
		else {
			if (location.protocol != 'file:') {
				window.location.href = 'auth.html';
			} else {
				uid = '-KmUZTaohwghpuagw';
			}
		}
		contactsRef = database.ref('users/'+uid+'/contacts');
		infoRef = database.ref('users/'+uid+'/info');
		contactsRef = database.ref('users/'+uid+'/contacts');
		infoRef = database.ref('users/'+uid+'/info');
		setUpLogic();
		populateContacts();
	});

	//Initates global variables we need for logic, etc.
	var now;
	var myrng;
	var myrngInt;
	var todayStr;
	var minThreshold;
	var maxThreshold;
	var todayStrNoYear;
	var distanceThreshold;
	var myCoordinates;
	var lightweightMobile;
	var modalContactKey = "";

	function populateContacts() {
		contactsRef.on("child_added", function(snap) {
			//Checks to see if contact is eligible (passes a logic check), then adds to DOM
			var selectionVal = selectionLogic(snap.key, snap.val());
			if(selectionVal > 0) {
				appendContactToDumpDiv(snap.key, snap.val(), selectionVal);
			};
		});
	}

	//Adds a new panel for each contact that is eligible
	function appendContactToDumpDiv(contactKey, contactVal, selectionVal) {

		var mainDiv = $("<div>");
		mainDiv.addClass("col-md-4");
		mainDiv.addClass("mainDiv");

		var divPanel = $("<div>");
		divPanel.addClass("panel panel-info contact-panel");
		divPanel.data("key", contactKey);

		var panelHeading = $("<div>");
		panelHeading.addClass("panel-heading clearfix");

		var panelTitle = $("<div>").addClass('panelTitle pull-left').append($("<h4>").text(contactVal.name));
		
		//Sets various topical treatments to provide context from our selection logic
		switch(selectionVal){
			case 1: 
			//Birthday
			panelHeading.append($("<div><i class='fa fa-birthday-cake bIcon pull-left' aria-hidden='true'></i></div>"));
			break;
			case 2:
			//Haven't talked in a while
			break;
			case 3: 
			//Random chance
			break;
			case 4: 
			//Nearby
			panelHeading.append($("<div><i class='fa fa-globe locIcon pull-left' aria-hidden='true'></i></div>"));
			break;
		}

		var panelHeadingIcons = $("<div>").addClass('pull-right');		

		//Adds info from settings for contacts that have it
		var panelBody = $("<div>");
		panelBody.addClass("panel-body hidden-sm hidden-xs");

		var notes = $("<span>");
		if (contactVal.lastTalked) {
			notes.append('<span><i class="fa fa-clock-o clockIcon" aria-hidden="true"></i>' + " " + contactVal.lastTalked + "   " + "</span>");
		}
		if (contactVal.birthday) {
			notes.append('<span class="text-center"><i class="fa fa-birthday-cake bCakeIcon" aria-hidden="true"></i>' + " " + contactVal.birthday + "   " + "</span>");
		}
		if (contactVal.city) {
			notes.append('<span class="text-center"><i class="fa fa-home homeIcon" aria-hidden="true"></i>' + " " + contactVal.city + "   " + "</span>");
		}
		notes.append('<br><br>');

		panelBody.append(notes);

		//Writes our various buttons (mobile, non, hidden, non)
		var check = $("<a>").addClass("checkMark btn btn-primary panelButton").attr("id", "checkBox");
		var icheck = $("<i>").addClass("fa fa-check").attr("aria-hidden", "true");
		check.append(icheck);

		var phoneMobile = $("<a>").attr("id", "phoneLine").attr("target", "_blank").addClass("btn btn-primary panelButton hidden-md hidden-lg");
		var phone = $("<a>").attr("id", "phoneLine").attr("target", "_blank").addClass("btn btn-primary panelButton hidden-sm hidden-xs");
		var textMobile = $("<a>").attr("id", "text").attr("target", "_blank").addClass("btn btn-primary panelButton hidden-md hidden-lg");
		var iphone = $("<i>").addClass("fa fa-phone").attr("aria-hidden", "true");
		var itext = $("<i>").addClass("fa fa-comments-o").attr("aria-hidden", "true");
		if (contactVal.telephone) {
			phone.attr("href", "tel://" + contactVal.telephone);
			phoneMobile.attr("href", "tel://" + contactVal.telephone);
			textMobile.attr("href", "sms://" + contactVal.telephone);
		} else {
			phone.attr('disabled',true);
			phoneMobile.attr('disabled',true);
			textMobile.attr('disabled',true);
		}
		phone.append(iphone);
		phoneMobile.append(iphone.clone());
		textMobile.append(itext);

		var email = $("<a>").attr("id", "emailID").attr("target", "_blank").addClass("btn btn-primary panelButton hidden-md hidden-lg");
		var gmail = $("<a>").attr("id", "gmailID").attr("target", "_blank").addClass("btn btn-primary panelButton hidden-sm hidden-xs");
		var iemail = $("<i>").attr("aria-hidden", "true").addClass("fa fa-envelope-o");

		if (contactVal.email) {
			email.attr("href", "mailto:" + contactVal.email);
			gmail.attr("href", "https://mail.google.com/mail/?view=cm&fs=1&to=" + contactVal.email);
		} else {
			email.attr('disabled', true);
			gmail.attr('disabled', true);
		}
		email.append(iemail);
		gmail.append(iemail.clone());

		var viewNotesPhone = $("<a>").addClass("btn btn-info panelButton hidden-md hidden-lg viewNotesSmall").append('<i class="fa fa-eye" aria-hidden="true"></i>');
		var addNotesPhone = $("<a>").addClass("btn btn-info panelButton hidden-md hidden-lg addNotesSmall").append('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>');

		var viewNotes = $("<a>").addClass("btn btn-info viewNotes");
		var iNotes = $("<i>").attr("aria-hidden", "true").text("View Notes").addClass("viewNotesButton");
		viewNotes.append(iNotes);

		var addNotes = $("<a>").addClass("btn btn-primary addNotes");
		var iaddNotes = $("<i>").attr("aria-hidden", "true").text("Add Notes").addClass("addNotesButton");
		addNotes.append(iaddNotes);

		//Checks for lightweight mode, and added classes that remove need for 'remove' button
		if (lightweightMobile) {
			email.addClass("dismissOnClick");
			phoneMobile.addClass("dismissOnClick");
			textMobile.addClass("dismissOnClick");
			check.addClass("hidden-sm hidden-xs");
		} else {
			panelHeadingIcons.append(viewNotesPhone);
			panelHeadingIcons.append(addNotesPhone);
		}

		//Adds buttons to panel header & body, then adds header & body to actual div
		panelHeadingIcons.prepend(email);
		panelHeadingIcons.prepend(gmail);
		panelHeadingIcons.prepend(textMobile);
		panelHeadingIcons.prepend(phone);
		panelHeadingIcons.prepend(phoneMobile);
		panelHeadingIcons.append(check);

		panelBody.append(viewNotes);
		panelBody.append(addNotes);

		panelHeading.append(panelTitle);
		panelHeading.append(panelHeadingIcons);

		divPanel.append(panelHeading);
		divPanel.append(panelBody);

		mainDiv.append(divPanel);

		//Writes to DOM
		$("#dump-div").append(mainDiv);

	}

	//Fills in global variables, from firebase where available, or from constants
	function setUpLogic() {
		//Gets today's date
		now = moment();
		todayStr = now.format('YYYY-MM-DD');
		todayStrNoYear = now.format('MM/DD');
		//Sets random number based on date
		myrng = new Math.seedrandom(todayStr);
		myrngInt = Math.floor(myrng()*1000000+1);
		//Grabs constants/user settings for minThreshold and maxThreshold and maxDistance
		minThreshold = 0.25;
		maxThreshold = 2;
		distanceThreshold = 25;
		infoRef.on("value", function(snap) {
			//console.log(snap.val());
			if (snap.val() !== null && (snap.val().minThreshold < 0.5 && snap.val().minThreshold >= 0)) {
				minThreshold = snap.val().minThreshold;
			}
			if (snap.val() !== null && snap.val().maxThreshold >= 1.5) {
				maxThreshold = snap.val().maxThreshold;
			}
			if (snap.val() !== null && snap.val().maxDistance >0) {
				distanceThreshold = snap.val().maxDistance;
			}
			if (snap.val() !== null) {
				lightweightMobile = snap.val().lightweightMobile || false;
			}
		});
	}

	//Takes a contact, and applies various logics against them to see if they should be on the main page
	function selectionLogic(contactKey, contact) {

		//console.log(contact);

		//Checks if it is their birthday, returns 1 if so
		if (contact.birthday) { 
			var convertedBday = moment(contact.birthday).format("MM/DD");
			if (convertedBday === todayStrNoYear) {
				//console.log('Today is ' + contact.name + "'s BIRTHDAY!!");
				return 1;
			}
		}

		//Checks if geolocation is enabled, then if they are within a certain distance
		if(myCoordinates && contact.long && contact.lat) {
			var d = distance(myCoordinates.latitude, myCoordinates.longitude, contact.lat, contact.long);
			//console.log(d);
			if (d <= distanceThreshold) {
				return 4;
			}
		}

		var lastTalkedNumberDays; 

		lastTalkedNumberDays = moment(todayStr, "YYYY-MM-DD").diff(moment(contact.lastTalked, "YYYY-MM-DD"), 'days');

		//Checks if they are randomly selected, assuming they are outside of a minimum threshold
		if ((myrngInt + contact.offset||0) % contact.days === 0 && (!contact.lastTalked || lastTalkedNumberDays >= minThreshold * contact.days)) {
			//console.log("random Function working");
			return 3;
		}

		//If you haven't talked to them long enough, adds them anyway
		if (lastTalkedNumberDays > maxThreshold * contact.days) {
			return 2; 
		}

		//Returns a 'non-pass' value if they don't get hit above
		return -1;
	}

	//Gets location from browser, then reruns the logic so we can see if people are close 
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				myCoordinates = position.coords;
				//console.log(myCoordinates);
				//Turns firebase off and on again now that we have location! Also blows up the contacts to avoid duplicates
				contactsRef.off();
				$(".mainDiv").remove();
				populateContacts();
			});
		} 
	}

	//Great circle distance function (accurate to ~5%, which is good enough for us)
	function distance(lat1, lon1, lat2, lon2) {
		var p = 0.017453292519943295;    // Math.PI / 180
		var c = Math.cos;
		var a = 0.5 - c((lat2 - lat1) * p)/2 + 
		c(lat1 * p) * c(lat2 * p) * 
		(1 - c((lon2 - lon1) * p))/2;
		return 3959 * 2 * Math.asin(Math.sqrt(a)); // R = 3959 miles
	}

	//Nukes panel when we talk to the person
	function removeDiv(button) {
		var key = button.parents('.contact-panel').data('key');
		console.log(key);
		button.parents('.mainDiv').remove();
		//addNote(key);
		mostRecentContact(key, button.attr("id"));
	}

	//Writes when/how the user contacted the person, and updates 'lastTalked' for logic above 
	function mostRecentContact(key, type) {
		contactsRef.child(key).update({
			lastTalked: todayStr
		});
		contactsRef.child(key).child('history').push({
			date: todayStr,
			type: type
		});
	}

	//Adds all our button functions
	$(document).on("click", ".addNotes", function () {
		newNoteModal($(this).parents('.contact-panel').data('key'));
	});
	$(document).on("click", ".addNotesSmall", function () {
		newNoteModal($(this).parents('.contact-panel').data('key'));
		console.log("Key " + $(this).parents('.contact-panel').data('key'));
	});
	$(document).on("click", ".viewNotes", function () {
		prevNotesModal($(this).parents('.contact-panel').data('key'));
	});
	$(document).on("click", ".viewNotesSmall", function () {
		console.log($(this).parents('.contact-panel').data('key'));
		console.log("something");
		prevNotesModal($(this).parents('.contact-panel').data('key'));
	});
	$(document).on("click","#saveNotesButton", function () {
		addNote(modalContactKey);
		$("#newNote").modal('hide');
	});
	$("#geolocationUpdateButton").click(function() {
		getLocation();
	});
	$(document).on("click",".checkMark", function() {
		removeDiv($(this));
	});
	$(document).on("click", ".dismissOnClick", function() {
		if($(this).attr('disabled') !== 'disabled') {
			removeDiv($(this));
		}
	});

	//Pops up new modal and sets the global variable modalContactKey to whichever row we clicked on
	function newNoteModal(contactKey) {
		$("#newNote").modal();
		modalContactKey = contactKey;
	}

	//Pops up modal that fetches all previously-written notes from that contact. Also empties the modal
	function prevNotesModal(contactKey) {
		$("#viewPrevNotes").modal();
		$("#prevNotesTable").children().children("tr:not(:first)").remove();
		var notesRef; 
		notesRef = database.ref('users/'+uid+'/contacts/'+contactKey+'/notes');
		notesRef.orderByKey().on("child_added", function(snapshot) {
			$("#prevNotesTable").append($('<tr>').append($('<td>').text(snapshot.val().date)).append($('<td>').text(snapshot.val().text)));
		});
	}

	//Adds note on save button press
	function addNote(key) {
		var noteText;
		noteText = $("#longNoteInput").val();
		contactsRef.child(key).child('notes').push({
			date: todayStr,
			text: noteText
		})
	}
});