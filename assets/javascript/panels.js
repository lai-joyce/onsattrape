

// $("#dump-div").append("<h1>" + "Hello World" + "</h1>");

// jQuery document load
$(function() {

	var A_SHORT_DISTANCE = 25;


	var config = {
		apiKey: "AIzaSyDp8OOm78pBLJEKkE6r4JKBg_MPzqhiCVQ",
		authDomain: "onsattrape.firebaseapp.com",
		databaseURL: "https://onsattrape.firebaseio.com",
		projectId: "onsattrape",
		storageBucket: "onsattrape.appspot.com",
		messagingSenderId: "1094671185695"
	};

	var uid = "-KmUZTaohwghpuagw";


	firebase.initializeApp(config);


	var database = firebase.database();

	var contactsRef = database.ref('users/'+uid+'/contacts');


	var localContacts = []; // in memory storage of the contacts

	function displayContacts() {

		$("#dump-div").empty(); // dump the dump

		$.each(localContacts, function( index, contact ) {
			console.log( index + ": " + contact );

			var selectionVal = selectionLogic(contact.key, contact);

			if(selectionVal > 0) {
				appendContactToDumpDiv(contact.key, contact);
			}
		});

		for(var contactKey in localContacts) {
			var contact = localContacts[contactKey];
			var contactKey = contact.key;

			
		}
	}

	function appendContactToDumpDiv(contactKey, contactVal) {

		var mainDiv = $("<div>");
		mainDiv.addClass("col-md-4");
		mainDiv.addClass("mainDiv");

		var divPanel = $("<div>");
		divPanel.addClass("panel panel-info contact-panel");
		divPanel.data("key", contactKey);

		var panelHeading = $("<div>");
		panelHeading.addClass("panel-heading clearfix");


		var panelTitle = $("<div>").addClass('panelTitle pull-left').text(contactVal.name);


		var panelHeadingIcons = $("<div>").addClass('pull-right');		

		// var imageHolder = $("<img>");
		// imageHolder.attr("src", "#");
		// panelHeading.append(imageHolder);

		

		$("#dump-div").append(mainDiv);


		var panelBody = $("<div>");
		panelBody.addClass("panel-body hidden-sm hidden-xs");

		var notes = $("<p>");
		notes.attr("id", "notesParagraph");
		if (contactVal.lastTalked) {
			notes.append("<h4>" + " Last time talked about: " + contactVal.lastTalked + "</h4>");
		}
		if (contactVal.birthday) {
			notes.append("<h5>" + " Birthday is on: " + contactVal.birthday + "</h5>");
		}
		if (contactVal.city) {
			notes.append("<h6>" + " Located currently in: " + contactVal.city + "</h6>");
		}



		panelBody.append(notes);

		var check = $("<a>");
		check.addClass("checkMark btn btn-primary panelButton");
		var icheck = $("<i>");
		icheck.addClass("fa fa-check");
		icheck.attr("aria-hidden", "true");
		check.append(icheck);


		if (contactVal.telephone) {
			var phone = $("<a>");
			phone.attr("href", "tel:" + contactVal.telephone);
			phone.attr("id", "phoneLine");
			phone.addClass("btn btn-primary panelButton");
			var iphone = $("<i>");
			iphone.addClass("fa fa-phone");
			iphone.attr("aria-hidden", "true");
			phone.append(iphone);
			panelHeadingIcons.append(phone);
		} else {
			var phone = $("<a>");
			phone.attr("id", "phoneLine");
			phone.attr('disabled',true);
			phone.addClass("btn btn-primary panelButton");
			var iphone = $("<i>");
			iphone.addClass("fa fa-phone");
			iphone.attr("aria-hidden", "true");
			phone.append(iphone);
			panelHeadingIcons.append(phone);
		}


		if (contactVal.email) {


			var email = $("<a>");
			email.attr("href", "mailto:" + contactVal.email);
			email.addClass("btn btn-primary panelButton hidden-md hidden-lg");
			var iemail = $("<i>");
			iemail.addClass("fa fa-envelope-o");
			iemail.attr("aria-hidden", "true");
			email.append(iemail);

			var gmail = $("<a>");
			gmail.attr("href", "https://mail.google.com/mail/?view=cm&fs=1&to=" + contactVal.email);
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

		} else {
			var email = $("<a>");
			email.addClass("btn btn-primary panelButton hidden-md hidden-lg");
			var iemail = $("<i>");
			iemail.addClass("fa fa-envelope-o");
			iemail.attr("aria-hidden", "true");
			email.attr('disabled', true);
			email.append(iemail);

			var gmail = $("<a>");
			gmail.attr("target", "_blank");
			gmail.attr("id", "gmailID");
			gmail.addClass("btn btn-primary panelButton hidden-sm hidden-xs");
			var igemail = $("<i>");
			igemail.addClass("fa fa-envelope-o");
			igemail.attr("aria-hidden", "true");
			gmail.attr('disabled', true);
			//igemail.text("g");
			gmail.append(igemail);

			panelHeadingIcons.append(email);
			panelHeadingIcons.append(gmail);
		}

			// var location = $("<a>");
			// //location.attr("href", "tel:" + snapshot.val().location);
			// location.attr("id", "location");
			// location.addClass("btn btn-primary panelButton");
			// location.append('<i class="fa fa-globe" aria-hidden="true"></i>');
			// var iLocation = $("<i>");
			// //iLocation.addClass("fa fa-location");
			// iLocation.attr("aria-hidden", "true");
			// location.append(iLocation);
			// panelHeadingIcons.append(location);


// trying to display add notes and view notes buttons when screen is iphone size
var viewNotesPhone = $("<a>");
		//check.attr("href", "#");
		viewNotesPhone.addClass("btn btn-info");
		viewNotesPhone.addClass("btn btn-primary panelButton hidden-md hidden-lg viewNotesSmall");
		viewNotesPhone.append('<i class="fa fa-eye" aria-hidden="true"></i>');
		var iNotesPhone = $("<i>");
		iNotesPhone.addClass("fa");
		//iNotes.addClass("fa-check");
		iNotesPhone.attr("aria-hidden", "true");
		iNotesPhone.text("View Notes");
		viewNotesPhone.append(iNotes);

		panelHeadingIcons.append(viewNotesPhone);


		var addNotesPhone = $("<a>");
		//check.attr("href", "#");
		addNotesPhone.addClass("btn btn-info addNotesSmall");
		addNotesPhone.addClass("btn btn-primary panelButton hidden-md hidden-lg addNotesSmall");
		addNotesPhone.append('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>');
		var iaddNotesPhone = $("<i>");
		iaddNotesPhone.addClass("fa");
		//iNotes.addClass("fa-check");
		iaddNotesPhone.attr("aria-hidden", "true");
		iaddNotesPhone.text("Add Notes");
		addNotesPhone.append(iaddNotes);

		panelHeadingIcons.append(addNotesPhone);
//-------------------------------------------------------- MIKE CHECK THIS IF OKEY -----------------




panelHeadingIcons.append(check);


var viewNotes = $("<a>");
		//check.attr("href", "#");
		viewNotes.addClass("btn btn-info viewNotes");
		var iNotes = $("<i>");
		iNotes.addClass("fa");
		//iNotes.addClass("fa-check");
		iNotes.attr("aria-hidden", "true");
		iNotes.text("View Notes");
		viewNotes.append(iNotes);

		panelBody.append(viewNotes);


		var addNotes = $("<a>");
		//check.attr("href", "#");
		addNotes.addClass("btn btn-primary addNotes");
		var iaddNotes = $("<i>");
		iaddNotes.addClass("fa");
		//iNotes.addClass("fa-check");
		iaddNotes.attr("aria-hidden", "true");
		iaddNotes.text("Add Notes");
		addNotes.append(iaddNotes);

		panelBody.append(addNotes);




		panelHeading.append(panelTitle);
		panelHeading.append(panelHeadingIcons);

		divPanel.append(panelHeading);

		divPanel.append(panelBody);

		mainDiv.append(divPanel);

		$("#dump-div").append(mainDiv);

	}

	function contactChildAddedHandler(snapshot) {

		var contactVal = snapshot.val();
		var contactKey = snapshot.key;

		contactVal.key = contactKey;
		localContacts.push(contactVal);

		//localContacts[snapshot.key] = contactVal;
		
		// update display
		displayContacts();
		displayContactsCount++;

		//Skips distance lookup if no city for contact
		if (!contactVal.city) {
			return;
		}

		var queryURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&" +
		"origins=" + contactVal.city + "&destinations=" + myCoordinates.latitude + "," + 
		myCoordinates.longitude + "&key=AIzaSyBa98pCggkp_lKy9w2FkWXJTWoDIJNoI9c";

		$.ajax({
			url: queryURL, 
			method: "GET",
			dataType: 'JSON',
			crossOrigin: true,
		}).done(function(response) {
			console.log(response); 
			var data = JSON.parse(response);
			// use Google Maps Distance Matrix API above to figure out distance 
			// in km between Contact and User City

			//Error handling if google does not return distance
			if (!data.rows[0].elements[0].distance) {
				return;
			}
			var distance = data.rows[0].elements[0].distance.value / 1609;
			var localContact = localContacts.find(function(c) { return c.key === contactKey; });

			if(distance <= A_SHORT_DISTANCE) {
				localContact.isAShortDistanceAway = true;
			}
			else {
				localContact.isAShortDistanceAway = false;
			}

			localContact.distanceAway = distance;
			displayContacts();
			displayContactsCount++;
		});


	}

	function addContactChildAddedListener() {
		contactsRef.on("child_added", contactChildAddedHandler);
	}
	
	var displayContactsCount;
	var now;
	var myrng;
	var myrngInt;
	var todayStr;
	var minThreshold;
	var maxThreshold;
	var todayStrNoYear;

	function setUpLogic() {
		//Gets today's date
		now = moment();
		todayStr = now.format('YYYY-MM-DD');
		todayStrNoYear = now.format('MM/DD');
		//Sets random number based on date
		myrng = new Math.seedrandom(todayStr);
		myrngInt = Math.floor(myrng()*1000000+1);
		//Grabs constants/user settings for minThreshold and maxThreshold
		var infoRef = database.ref('users/'+uid+'/info');
		minThreshold = 0.25;
		maxThreshold = 2;
		infoRef.on("value", function(snap) {
			if (snap.val() !== null && (snap.val().minThreshold < 0.5 && snap.val().minThreshold >= 0)) {
				minThreshold = snap.val().minThreshold;
			}
			if (snap.val() !== null && snap.val().maxThreshold >= 1.5) {
				maxThreshold = snap.val().maxThreshold;
			}
		});
	}

	setUpLogic();

	//contactsRef.on("child_added", contactChildAddedHandler);

	function selectionLogic(contactKey, contact) {
		
		if (contact.birthday) { 
			var convertedBday = moment(contact.birthday).format("MM/DD");
		}

		console.log(convertedBday);
		// console.log(todayStrNoYear);
		if (convertedBday === todayStrNoYear) {
			console.log('Today is ' + contact.name + "'s BIRTHDAY!!");
			return 1;
		}

		if (contact.isAShortDistanceAway) {
			return 4;
		}

		var lastTalkedNumberDays; 

		lastTalkedNumberDays = moment(todayStr, "YYYY-MM-DD").diff(moment(contact.lastTalked, "YYYY-MM-DD"), 'days');
	 
		// console.log((myrngInt + contact.offset) % contact.days === 0);
		
		if ((myrngInt + contact.offset) % contact.days === 0 && 
			(isNaN(lastTalkedNumberDays) || 
				lastTalkedNumberDays > minThreshold * contact.days)) {
			console.log("random Function working");
		return 3;
	}

	if (lastTalkedNumberDays > maxThreshold * contact.days) {
		return 2; 
	}
	
	return -1;
	}

	var myCoordinates;

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				myCoordinates = position.coords;

				$("#currentGeolocation").text("(" + 
					myCoordinates.latitude + "," + myCoordinates.longitude + ")");

				addContactChildAddedListener();
			});
		} else {

		}
		
	}

	$("#geolocationUpdateButton").click(function() {
		getLocation();
	});

	$(document).on("click",".checkMark", removeDiv);



	function removeDiv() {



		var key = $(this).parents('.contact-panel').data('key');

		console.log(key);
		$(this).parents('.mainDiv').remove();
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
			lastTalked: todayStr
		})
	}




	function createNewModal() {


	};



});
