try {
	var type = $('fhirType').toLowerCase();
	var id = $('fhirId');
	var requestURL = $('url');
	if (!requestURL.endsWith('/')) {
		requestURL += '/';
	}
	var requestURL = new java.net.URI(requestURL);

	var _count = $('parameters').getParameter('_count');
	if (_count) {
		_count = parseInt(_count, 10);
		if (!_count) {
			return createOperationOutcome('error', 'invalid', 'Parameter _count formatted incorrectly: ' + $('parameters').getParameter('_count'));
		}
	}
	
	var _since = $('parameters').getParameter('_since');
	if (_since) {
		try {
			_since = convertDate(_since, 'yyyy-MM-dd HH:mm:ss.SSSZZ');
		} catch (e) {
			return createOperationOutcome('error', 'invalid', 'Parameter _since formatted incorrectly: ' + _since);
		}
	}

	// Build up the WHERE clause and prepared query parameters
	var whereParts = [];
	var params = [];
	
	if (type && id) {
		// history-instance
		whereParts.push("name = ?");
		whereParts.push("id = ?");
		params.push(type);
		params.push(id);
	} else if (type) {
		// history-type
		whereParts.push("name = ?");
		params.push(type);
	}

	if (_since) {
		whereParts.push(getFhirHistorySinceWherePart());
		params.push(_since);
	}

	// Build up the actual query
	var query = getFhirHistoryBaseQuery();
	if (whereParts.length > 0) {
		query += " WHERE " + whereParts.join(" AND ");
	}
	query += " ORDER BY name ASC, id ASC, version DESC";
	if (_count > 0) {
		query += " LIMIT " + _count;
	}

	var result = executeCachedQuery(query, params);
	var bundle = new Packages.org.hl7.fhir.dstu3.model.Bundle().setType(Packages.org.hl7.fhir.dstu3.model.Bundle.BundleType.HISTORY);

	while (result.next()) {
		var entryType = getResultSetString(result, 'name');
		var entryId = getResultSetString(result, 'id');
		var entryVersion = result.getInt('version');
		var entryData = getResultSetString(result, 'data');
		var entryContentType = getResultSetString(result, 'mimetype');
		var entryDeleted = result.getBoolean('deleted');
		var entryRequestMethod = getResultSetString(result, 'request_method');
		var entryRequestURL = getResultSetString(result, 'request_url');
		
		var resourceType = FhirUtil.getResourceType(entryType);
		if (resourceType != null) {
			entryType = resourceType.getPath();
		}

		var request = new Packages.org.hl7.fhir.dstu3.model.Bundle.BundleEntryRequestComponent().setMethod(new Packages.org.hl7.fhir.dstu3.model.Bundle.HTTPVerbEnumFactory().fromCode(entryRequestMethod)).setUrl(entryRequestURL);
		var entry = bundle.addEntry().setRequest(request);
		
		if (!entryDeleted) {
			var relativeUrl = '../';
			if (id) {
				relativeUrl += '../';
			}
			entry.setFullUrl(requestURL.resolve(relativeUrl + entryId + '/_history/' + entryVersion).toString());
			entry.setResource(FhirUtil.fromXML(entryData));
		}
	}

	bundle.setTotal(bundle.getEntry().size());

	var response = FhirResponseFactory.getHistoryResponse(FhirUtil.toXML(bundle), 200, FhirUtil.getMIMETypeXML());
	responseMap.put('response', response);
	return response.getMessage();
} catch (e) {
	return createOperationOutcome('error', 'transient', 'Error retrieving resource history.', 500, e);
}