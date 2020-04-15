/**
	Constructs a new FHIR Patient object from the PID and NK1 segments. Also consolidates and cleans up
	empty fields.

	@param {XML} msg - The E4X XML representation of the HL7 v2.x message.
	@return {Object} The JavaScript Object representation of the FHIR Patient.
*/
function createAndConsolidateFhirPatient(msg) {
	return consolidate(cleanupFhirPatient(createFhirPatient(msg)));
}