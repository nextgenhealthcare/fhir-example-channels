/**
	Creates a new array of FHIR Patient_Contact objects for all NK1 segments in the message.

	@param {XML} nk1List - The E4X XML NK1 list from the HL7 v2.x message.
	@return {Array} The array of Patient_Contact objects.
*/
function createPatientContacts(nk1List) {
	var contacts = Lists.list();
	for (var i = 0; i < nk1List.length(); i++) {
		contacts.add(createPatientContact(nk1List[i]));
	}
	return contacts.toArray();
}