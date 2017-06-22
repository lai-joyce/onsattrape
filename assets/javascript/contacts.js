

var testContact = {
	name: "Michael",
	phone: 6514429511,
	email: "michael.t.halvorson@gmail.com"
};

var uid = "-KmUZTaohwghpuagw";

var database = firebase.database();
var contactsRef = database.ref("users/"+uid+"/contacts");

contactsRef.orderByChild("name").on("value", function(snap) {
	console.log();
	$("#contactTable td").remove();
	snap.forEach(function(contact) {
		var contactVal = contact.val();
		$("#contactTable").append($("<tr>").data("key",contact.key).data("values",contactVal).append($("<td>").text(contactVal.name)).append($("<td>").text(contactVal.telephone)).append($("<td>").text(contactVal.email)).append($("<td>").text(contactVal.days)).append($("<td>").text(contactVal.city).addClass("hidden-xs hidden-sm")).append($("<td>").text(contactVal.birthday).addClass("hidden-xs hidden-sm")).append($("<td>").append($("<button>").text("Edit").addClass("edit btn btn-default"))).append($("<td>").append($("<button>").text("Delete").addClass("delete btn btn-default"))));
	});
});

$(document).on("click", ".edit", editContact);
$(document).on("click", "#newContact", newContact);
$(document).on("click", ".delete", deleteContact);

var newContactEligible = false;
var editContactEligible = false;

function newContact () {
	newContactEligible = true;
	editContactEligible = false;
	$("#editContact").modal();
	$("#nameInput").val("");
	$("#telephoneInput").val("");
	$("#emailInput").val("");
	$("#bdayInput").val();
	$("#locationInput").val("");
	$("#saveButton").text("Add New Person");
	$("#daysBetweenInput").val(7);
	$("#saveButton").on("click", function() {
        var isCreateRight = validateName() && validatePhone();
		if (newContactEligible && isCreateRight) {
			contactsRef.push({
				name: $("#nameInput").val().trim(),
				telephone: $("#telephoneInput").val().trim(),
				email: $("#emailInput").val().trim(),
				birthday: $("#bdayInput").val().trim(),
				city: $("#locationInput").val().trim(),
				days: Number($("#daysBetweenInput").val().trim()),
				offset: Math.floor(Math.random()*1000000+1)
			});
			newContactEligible = false;
            $("#editContact").modal("hide");
		}

	});
}

function deleteContact () {
	var row = $(this).parent().parent();
	contactKey =  row.data("key");
	console.log(contactKey);
	$("#deleteConfirm").modal();
	$("#deleteButton").on("click", function() {
		contactsRef.child(contactKey).remove();
		$("#deleteConfirm").modal("hide");
	});
}

var contactKey = "";

function editContact () {
	newContactEligible = false;
	editContactEligible = true;
	var row = $(this).parent().parent();
	contactKey =  row.data("key");
	console.log(contactKey);
	$("#editContact").modal();
	$("#nameInput").val(row.data("values").name);
	$("#telephoneInput").val(row.data("values").telephone);
	$("#emailInput").val(row.data("values").email);
	$("#bdayInput").val(row.data("values").birthday);
	$("#locationInput").val(row.data("values").city);
	$("#daysBetweenInput").val(row.data("values").days);
	$("#saveButton").on("click", function() {
	    var isValid = validateName() && validatePhone(); // && validateEmail()

		if (editContactEligible && isValid) {
			contactsRef.child(contactKey).update({
				name: $("#nameInput").val().trim(),
				telephone: $("#telephoneInput").val().trim(),
				email: $("#emailInput").val().trim(),
				birthday: $("#bdayInput").val().trim(),
				city: $("#locationInput").val().trim(),
				days: Number($("#daysBetweenInput").val().trim())
			});
			editContactEligible = false;
		    $("#editContact").modal("hide");
		}
	});
}




    function validateName() {
        var name = document.getElementById("nameInput").value;

        if (name.length === 0)
        {
            producePrompt("Name is required", "errName", "red");
            return false;

        } else if (!name.match(/[A-Za-z]*\s{1}[A-Za-z]*$/)) {
            producePrompt("First and Last Name Please", "errName", "red");
            return false;

        } else {
            producePrompt("Welcome " + name , "errName", "green");
            return true;
        }
    }



    function validatePhone() {
        var phone= document.getElementById("telephoneInput").value;

        if (phone.length === 0){

            producePrompt("Phone Number is Required",  "errTelephone", "red");
            return false;

        } if (phone.length !== 10) {

            producePrompt("Phone Number Must Include Area Code", "errTelephone", "red");
            return false;

        }else if (!phone.match(/^[0-9]{10}$/)) {
            producePrompt("Please Only Include Digits", "errTelephone", "red");
            return false;

        } else {
            producePrompt("Valid Number", "errTelephone", "green");
            return true;


        }}


    function validateEmail() {
        var email = document.getElementById("emailInput").value;

        if (email.length === 0) {
            producePrompt("Email is Required", "errMail", "red");
            return false;

        }else if(!email.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
            producePrompt("Email Address Invalid", "errMail", "red");
            return false;

        }else {
            producePrompt("Valid Email Address", "errMail", "green");
            return true;
        }

    }

//$("locationInput").geocomplete();

    $.log = function(message){
        var $logger = $("#logger");
        $logger.html($logger.html() + "\n * " + message );
    }

    $(function(){

        $("#locationInput").geocomplete()
            .bind("geocode:result", function(event, result){
                $.log("Result: " + result.formatted_address);
            })
            .bind("geocode:error", function(event, status){
                $.log("ERROR: " + status);
            })
            .bind("geocode:multiple", function(event, results){
                $.log("Multiple: " + results.length + " results found");
            });

        $("#find").click(function(){
            $("#locationInput").trigger("geocode");
        });


        /*$("#examples a").click(function(){
            $("#locationInput").val($(this).text()).trigger("geocode");
            return false;
        });*/

    });

    // For the Map
    $(function(){

        var options = {
            map: "",//".map_canvas"
            location: ""//"NYC"
        };

        $("#locationInput").geocomplete(options);

    });

    // function validateForm(){
    //     if(!validateName() || !validatePhone() || !validateEmail())
    //     {
    //         jsShow("errSubmit");
    //         producePrompt("Form Must be Valid to Submit", "errSubmit", "red");
    //         setTimeout(function (){jsHide("errSubmit");}, 2000);
    //     }
    // }
    //
    // function jsShow(id){
    //     document.getElementById(id).style.display = "block";
    // }
    //
    // function jsHide(id){
    //     document.getElementById(id).style.display = "none";
    // }

    function producePrompt(message, promptLocation, color)
        {
            document.getElementById(promptLocation).innerHTML = message;
            document.getElementById(promptLocation).style.color = color;
        }


