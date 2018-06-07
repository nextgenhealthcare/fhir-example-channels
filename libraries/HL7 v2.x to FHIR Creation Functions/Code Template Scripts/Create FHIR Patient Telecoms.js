/**
	Creates a new array of FHIR ContactPoint objects from the given PID segment.

	@param {XML} pid - The E4X XML PID node from the HL7 v2.x message.
	@return {Array} The array of ContactPoint objects.
*/
function createPatientTelecoms(pid) {
	var telecoms = Lists.list();
	for (var i = 0; i < pid['PID.13'].length(); i++) {
		telecoms.add(createPatientTelecom(pid['PID.13'][i], 'home'));
	}
	for (var i = 0; i < pid['PID.14'].length(); i++) {
		telecoms.add(createPatientTelecom(pid['PID.14'][i], 'work'));
	}
	return telecoms.toArray();
}