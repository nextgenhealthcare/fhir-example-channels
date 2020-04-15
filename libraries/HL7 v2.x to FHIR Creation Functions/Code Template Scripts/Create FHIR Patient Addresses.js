/**
	Creates a new array of FHIR Address objects from the given PID segment.

	@param {XML} pid - The E4X XML PID node from the HL7 v2.x message.
	@return {Array} The array of Address objects.
*/
function createPatientAddresses(pid) {
	var addresses = Lists.list();
	for (var i = 0; i < pid['PID.11'].length(); i++) {
		addresses.add(createPatientAddress(pid['PID.11'][i]));
	}
	return addresses.toArray();
}