/**
	Creates a new array of FHIR HumanName objects from the given PID segment.

	@param {XML} pid - The E4X XML PID node from the HL7 v2.x message.
	@return {Array} The array of HumanName objects.
*/
function createPatientNames(pid) {
	var names = Lists.list();
	for (var i = 0; i < pid['PID.5'].length(); i++) {
		names.add(createPatientName(pid['PID.5'][i]));
	}
	for (var i = 0; i < pid['PID.9'].length(); i++) {
		names.add(createPatientName(pid['PID.9'][i]));
	}
	return names.toArray();
}