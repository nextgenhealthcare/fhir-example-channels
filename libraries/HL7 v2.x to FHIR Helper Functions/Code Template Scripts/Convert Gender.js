/**
	Converts an HL7 v2.x gender code to the corresponding FHIR code.

	@param {String} code - The HL7 gender code (Table 0001)
	@return {String} The FHIR administrative gender code
*/
function convertToFhirGender(code) {
	var fhirCode;
	
	switch ((code + '').toUpperCase()) {
		case 'F':
			fhirCode = org.hl7.fhir.r4.model.codesystems.AdministrativeGender.FEMALE;
			break;
		case 'M':
			fhirCode = org.hl7.fhir.r4.model.codesystems.AdministrativeGender.MALE;
			break;
		case 'O':
		case 'A':
		case 'N':
			fhirCode = org.hl7.fhir.r4.model.codesystems.AdministrativeGender.OTHER;
			break;
		case 'U':
		default:
			fhirCode = org.hl7.fhir.r4.model.codesystems.AdministrativeGender.UNKNOWN;
	}

	return fhirCode.toCode();
}