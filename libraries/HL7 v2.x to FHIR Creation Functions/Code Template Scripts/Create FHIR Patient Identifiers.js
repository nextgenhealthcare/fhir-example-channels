/**
	Creates a new array of FHIR Identifier objects from the given PID segment.

	@param {XML} pid - The E4X XML PID node from the HL7 v2.x message.
	@return {Array} The array of Identifier objects.
*/
function createPatientIdentifiers(pid) {
	var identifiers = Lists.list();
	for (var i = 0; i < pid['PID.3'].length(); i++) {
		identifiers.add(createPatientIdentifier(pid['PID.3'][i]));
	}
	return identifiers.toArray();
}