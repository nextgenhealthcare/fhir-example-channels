try {
	var fhirVersion = $('fhirVersion');
	var type = $('fhirType').toLowerCase();
	var id = $('fhirId');

	var result = getFhirVersionAndDeleted(type, id);
	var response;
	
	if (result.next() && !result.getBoolean('deleted')) {
		var versionId = result.getInt('version') + 1;
		var lastUpdated = new java.util.Date();
		var sequenceId = insertFhirDeletedResource(type, id, versionId, lastUpdated, $('method'), $('url'));
		response = FhirResponseFactory.getDeleteResponse(versionId, lastUpdated, 204);
	} else {
		response = FhirResponseFactory.getDeleteResponse(null, null, 200);
	}

	responseMap.put('response', response);
} catch (e) {
	return createOperationOutcome('error', 'transient', 'Error deleting resource.', fhirVersion, 500, e);
}