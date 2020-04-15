/**
	Converts an HL7 v2.x formatted date into the correct format for FHIR date.
	
	HL7 format expected: yyyyMMdd
	FHIR format: yyyy-MM-dd

	@param {String} date - The HL7 v2.x date string
	@return {String} The converted FHIR date string
*/
function convertToFhirDate(date) {
	return convertToFhirTimestamp(date, "yyyy-MM-dd");
}