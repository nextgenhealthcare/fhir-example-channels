/**
	Creates a FHIR OperationOutcome resource and adds it to the response map with the key "response".

	@param {String} severity - Indicates whether the issue indicates a variation from successful
		processing. Values: fatal | error | warning | information
	@param {String} code - Describes the type of the issue. The system that creates an
		OperationOutcome SHALL choose the most applicable code from the IssueType value set, and may
		additional provide its own code for the error in the details element. Values: invalid | security |
		processing | transient | informational
	@param {String} details - Additional details about the error. This may be a text description of
		the error, or a system code that identifies the error.
	@param {String} fhirVersion - The FHIR version of the OperationOutcome resource. Values: DSTU2 | DSTU2_1 | 
		   DSTU_HL7ORG | STU3 | R4 | R5
	@param {int} httpStatusCode - The HTTP status code to send back with the response. Defaults to 400
		if not specified.
	@param {Error} e - If included, this will be used to build up the response status message and
		error.
	@param {Boolean} isFormatXML - If true, the resource will be formatted in XML. Otherwise, it will
		be formatted in JSON. If not specified, it will attempt to find the _format parameter in the source
		map, or return JSON.
	@return {Response} The created Response object.
*/
function createOperationOutcome(severity, code, details, fhirVersion, httpStatusCode, e, isFormatXML) {
	if (!httpStatusCode) {
		httpStatusCode = 400;
	}

	if (!isFormatXML && $s('parameters') && $s('parameters').contains('_format')) {
		isFormatXML = !FhirUtil.isJSON($s('parameters').getParameter('_format'));
	}

	var outcome = FhirUtil.createOperationOutcome(severity, code, details, fhirVersion);
	var message = isFormatXML ? FhirUtil.toXML(outcome, fhirVersion) : FhirUtil.toJSON(outcome, fhirVersion);
	responseMap.put('response', FhirResponseFactory.getResponse(message, httpStatusCode, isFormatXML ? FhirUtil.getMIMETypeXML() : FhirUtil.getMIMETypeJSON()));
	var response = new Response(message);
	response.setStatusMessage(severity.toUpperCase() + ' OperationOutcome created with status ' + httpStatusCode + '.');

	if (httpStatusCode >= 400) {
		response.setStatus(Status.ERROR);

		if (e) {
			var customMessage = 'Channel ' + channelName + ': ';
			if (e.rhinoException) {
				customMessage += 'Error on line ' + e.rhinoException.lineNumber() + ': ';
			}
			customMessage += e.toString();
	
			var errorContent = com.mirth.connect.util.ErrorMessageBuilder.buildErrorMessage('FHIR Listener', customMessage, e.javaException || null);
			if (e.javaException) {
				logger.error(errorContent, e.javaException);	
			} else {
				logger.error(errorContent);
			}
			response.setError(errorContent);
		}
	}

	return response;
}