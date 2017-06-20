

var testContact = {
	name: "Michael",
	phone: 6514429511,
	email: "michael.t.halvorson@gmail.com"
}

var uid = "-KmUZTaohwghpuagw";

var database = firebase.database();
var contactsRef = database.ref('users/'+uid+'/contacts');

contactsRef.orderByChild('name').on("value", function(snap) {
	console.log();
	$("#contactTable td").remove();
	snap.forEach(function(contact) {
		var contactVal = contact.val();
		$("#contactTable")
			.append($("<tr>").data('key',contact.key).data('values',contactVal)
			.append($("<td>").text(contactVal.name))
			.append($("<td>").text(contactVal.telephone))
			.append($("<td>").text(contactVal.email).addClass('hidden-xs hidden-sm'))
			.append($("<td>").text(contactVal.email.substring(0,5)+((contactVal.email.length > 5) ? "..." : "")).addClass('hidden-md hidden-lg'))
			.append($("<td>").text(contactVal.days))
			.append($("<td>").text(contactVal.city).addClass('hidden-xs hidden-sm'))
			.append($("<td>").text(contactVal.birthday).addClass('hidden-xs hidden-sm'))
			.append($("<td>").append($("<button>").text("Edit").addClass("edit btn btn-default"))));
	});
});

$(document).on("click", ".edit", editContact);
$(document).on("click", "#newContact", newContact);
$(document).on("click", "#deleteButtonEditModal", function () {
	deleteContact(contactKey);
});

var newContactEligible = false;
var editContactEligible = false;

function newContact () {
	newContactEligible = true;
	editContactEligible = false;
	contactKey = '';
	$("#editContact").modal();
	$("#deleteButtonEditModal").hide();
	$("#nameInput").val("");
	$("#telephoneInput").val("");
	$("#emailInput").val("");
	$("#bdayInput").val();
	$("#locationInput").val("");
	$("#saveButton").text("Add New Person");
	$("#daysBetweenInput").val(7);
	$("#saveButton").on("click", function() {
		if (newContactEligible) {
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
		}
		$('#editContact').modal('hide');
	});
}

function deleteContact (contactKey) {
	//var row = $(this).parents('tr');
	//contactKey =  row.data('key');
	//console.log(contactKey);
	$("#deleteConfirm").modal();
	$('#deleteButton').on('click', function() {
		contactsRef.child(contactKey).remove();
		$('#deleteConfirm').modal('hide');
		$('#editContact').modal('hide');
	});
}

var contactKey = '';

function editContact () {
	newContactEligible = false;
	editContactEligible = true;
	var row = $(this).parents('tr');
	contactKey =  row.data('key');
	console.log(contactKey);
	$("#editContact").modal();
	$("#deleteButtonEditModal").show();
	$("#nameInput").val(row.data('values').name);
	$("#telephoneInput").val(row.data('values').telephone);
	$("#emailInput").val(row.data('values').email);
	$("#bdayInput").val(row.data('values').birthday);
	$("#locationInput").val(row.data('values').city);
	$("#daysBetweenInput").val(row.data('values').days);
	$("#saveButton").text("Save");
	$("#saveButton").on("click", function() {
		if (editContactEligible) {
			contactsRef.child(contactKey).update({
				name: $("#nameInput").val().trim(),
				telephone: $("#telephoneInput").val().trim(),
				email: $("#emailInput").val().trim(),
				birthday: $("#bdayInput").val().trim(),
				city: $("#locationInput").val().trim(),
				days: Number($("#daysBetweenInput").val().trim())
			});
			editContactEligible = false;
		}
		$('#editContact').modal('hide');
	});
}