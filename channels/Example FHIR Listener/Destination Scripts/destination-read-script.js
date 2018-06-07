try {
	var type = $('fhirType').toLowerCase();
	var id = $('fhirId');
	
	var result = getResource(type, id);
	
	if (result.next()) {
		var version = new String(result.getInt('version'));
		var data = getResultSetString(result, 'data');
		var contentType = getResultSetString(result, 'mimetype');
		var lastModified = getResultSetDate(result, 'last_modified');
		var deleted = result.getBoolean('deleted');

		if (deleted) {
			return createOperationOutcome('error', 'processing', $('fhirType') + ' ID ' + id + ' has been deleted.', 410);
		} else {
			var response = FhirResponseFactory.getReadResponse(data, version, lastModified, 200, contentType);
			responseMap.put('response', response);
			return response.getMessage();
		}
	} else {
		return createOperationOutcome('error', 'processing', $('fhirType') + ' ID ' + id + ' not found.', 404);
	}
} catch (e) {
	return createOperationOutcome('error', 'transient', 'Error reading resource.', 500, e);
}