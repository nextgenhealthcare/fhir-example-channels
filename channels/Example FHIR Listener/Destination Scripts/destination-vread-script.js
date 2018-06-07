try {
	var type = $('fhirType').toLowerCase();
	var id = $('fhirId');
	var versionId = $('fhirVid');
	
	var result = getResourceVersion(type, id, versionId);
	
	if (result.next()) {
		var data = getResultSetString(result, 'data');
		var contentType = getResultSetString(result, 'mimetype');
		var lastModified = getResultSetDate(result, 'last_modified');
		var deleted = result.getBoolean('deleted');

		if (deleted) {
			return createOperationOutcome('error', 'processing', $('fhirType') + ' ID ' + id + ' at version ' + versionId + ' has been deleted.', 410);
		} else {
			var response = FhirResponseFactory.getVreadResponse(data, lastModified, 200, contentType);
			responseMap.put('response', response);
			return response.getMessage();
		}
	} else {
		return createOperationOutcome('error', 'processing', $('fhirType') + ' ID ' + id + ' at version ' + versionId + ' not found.', 404);
	}
} catch (e) {
	return createOperationOutcome('error', 'transient', 'Error reading resource.', 500, e);
}