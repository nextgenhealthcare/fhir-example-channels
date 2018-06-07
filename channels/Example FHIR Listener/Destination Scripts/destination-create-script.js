try {
	var type = $('fhirType').toLowerCase();
	var id = UUIDGenerator.getUUID();
	var versionId = 1;
	var data = AttachmentUtil.reAttachMessage(connectorMessage);
	var contentType = FhirUtil.getMIMETypeXML();
	var preferReturn = getPreferValue();

	var resource = FhirUtil.fromXML(data);
	var resourceType = resource.getResourceType();

	if (resourceType == null) {
		return createOperationOutcome('error', 'invalid', 'Resource type unknown, cannot be created as a(n) ' + $('fhirType') + ' resource.');
	} else if (resourceType.toString().toLowerCase() != type) {
		return createOperationOutcome('error', 'invalid', 'Resource type ' + resourceType + ' cannot be created as a(n) ' + $('fhirType') + ' resource.');
	}

	var lastUpdated = updateResourceMeta(resource, id, versionId);

	data = FhirUtil.toXML(resource).replaceAll('\\s*xmlns:?[^=]*\\s*=\\s*"http://hl7.org/fhir"', '');

	insertFhirResource(type, id, versionId, lastUpdated, data, contentType, $('method'), $('url'));

	var response;
	if (preferReturn == 'minimal' || (!preferReturn && type == 'binary')) {
		// If the Prefer header is set to minimal then don't send back the created resource
		response = FhirResponseFactory.getCreateResponse(id, versionId, lastUpdated, 201);
		if (preferReturn == 'minimal') {
			response.addHeader('Preference-Applied', 'return=minimal');
		}
	} else {
		response = FhirResponseFactory.getCreateResponse(data, id, versionId, lastUpdated, 201, contentType);
		if (preferReturn == 'representation') {
			response.addHeader('Preference-Applied', 'return=representation');
		}
	}
	
	responseMap.put('response', response);
	return response.getMessage();
} catch (e) {
	return createOperationOutcome('error', 'transient', 'Error creating resource.', 500, e);
}