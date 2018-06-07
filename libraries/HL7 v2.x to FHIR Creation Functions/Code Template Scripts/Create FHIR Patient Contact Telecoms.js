/**
	Creates a new array of FHIR ContactPoint objects from the given NK1 segment.

	@param {XML} nk1 - The E4X XML NK1 segment from the HL7 v2.x message.
	@return {Array} The array of ContactPoint objects.
*/
function createPatientContactTelecoms(nk1) {
	var telecoms = Lists.list();
	for (var i = 0; i < nk1['NK1.5'].length(); i++) {
		telecoms.add(createPatientTelecom(nk1['NK1.5'][i], 'home'));
	}
	for (var i = 0; i < nk1['NK1.6'].length(); i++) {
		telecoms.add(createPatientTelecom(nk1['NK1.6'][i], 'work'));
	}
	return telecoms.toArray();
}