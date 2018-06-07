try {
	var type = $('fhirType').toLowerCase();
	var id = $('fhirId');
	var data = AttachmentUtil.reAttachMessage(connectorMessage);
	var contentType = FhirUtil.getMIMETypeXML();
	var responseCode = 201;
	var preferReturn = getPreferValue();

	var resource = FhirUtil.fromXML(data);
	var resourceType = resource.getResourceType();

	if (resourceType == null) {
		return createOperationOutcome('error', 'invalid', 'Resource type unknown, cannot be updated as a(n) ' + $('fhirType') + ' resource.');
	} else if (resourceType.toString().toLowerCase() != type) {
		return createOperationOutcome('error', 'invalid', 'Resource type ' + resourceIdElement.getResourceType() + ' cannot be updated as a(n) ' + $('fhirType') + ' resource.');
	}

	var versionId = getFhirVersion(type, id) + 1;
	if (versionId > 1) {
		responseCode = 200;
	}

	var lastUpdated = updateResourceMeta(resource, id, versionId);
	
	data = FhirUtil.toXML(resource).replaceAll('\\s*xmlns:?[^=]*\\s*=\\s*"http://hl7.org/fhir"', '');

	insertFhirResource(type, id, versionId, lastUpdated, data, contentType, $('method'), $('url'));

	var response;
	if (preferReturn == 'minimal' || (!preferReturn && type == 'binary')) {
		// If the Prefer header is set to minimal then don't send back the created resource
		response = FhirResponseFactory.getUpdateResponse(versionId, lastUpdated, responseCode);
		if (preferReturn == 'minimal') {
			response.addHeader('Preference-Applied', 'return=minimal');
		}
	} else {
		response = FhirResponseFactory.getUpdateResponse(data, versionId, lastUpdated, responseCode, contentType);
		if (preferReturn == 'representation') {
			response.addHeader('Preference-Applied', 'return=representation');
		}
	}
	responseMap.put('response', response);
	return response.getMessage();
} catch (e) {
	return createOperationOutcome('error', 'transient', 'Error updating resource.', 500, e);
}