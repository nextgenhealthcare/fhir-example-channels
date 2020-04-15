/**
	Converts an HL7 v2.x address type code to the corresponding FHIR address use.

	@param {String} code - The HL7 address type (Table 0190)
	@return {String} The FHIR address use code
*/
function convertAddressUse(code) {
	var fhirCode;
	
	switch ((code + '').toUpperCase()) {
		case 'H':
		case 'L':
		case 'M':
		case 'P':
		case 'SH':
			fhirCode = org.hl7.fhir.r4.model.codesystems.AddressUse.HOME;
			break;
		case 'B':
		case 'O':
		case 'BI':
			fhirCode = org.hl7.fhir.r4.model.codesystems.AddressUse.WORK;
			break;
		case 'C':
		case 'V':
			fhirCode = org.hl7.fhir.r4.model.codesystems.AddressUse.TEMP;
			break;
		default:
			fhirCode = org.hl7.fhir.r4.model.codesystems.AddressUse.OLD;
	}

	return fhirCode.toCode();
}