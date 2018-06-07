/**
	Converts an HL7 v2.x formatted timestamp into the correct format for FHIR dateTime.
	
	HL7 format expected: yyyyMMddHHmmssZZ
	FHIR format: yyyy-MM-dd'T'HH:mm:ssZZ

	@param {String} date - The HL7 v2.x timestamp string
	@return {String} The converted FHIR timestamp string
*/
function convertToFhirTimestamp(date) {
	if (!date) {
		return '';
	}

	var patterns = [
		"yyyyMMddHHmmss.SSSZZ",
		"yyyyMMddHHmmss.SSSZ",
		"yyyyMMddHHmmss.SSS",
		"yyyyMMddHHmmssZZ",
		"yyyyMMddHHmmssZ",
		"yyyyMMddHHmmss",
		"yyyyMMddHHmm",
		"yyyyMMddHH",
		"yyyyMMdd"
	];

	var instant;
	for each (pattern in patterns) {
		try {
			instant = org.joda.time.format.DateTimeFormat.forPattern(pattern).parseMillis(new String(date));
			break;
		} catch(e) {}
	}

	if (instant) {
		var outpattern = arguments.length >= 2 ? arguments[1] : "yyyy-MM-dd'T'HH:mm:ssZZ";
		try {
			return org.joda.time.format.DateTimeFormat.forPattern(outpattern).print(instant);
		} catch (e) {}
	}
	
	return date;
}