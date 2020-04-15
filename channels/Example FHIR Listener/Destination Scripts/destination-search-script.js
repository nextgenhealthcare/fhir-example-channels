try {
	var fhirVersion = $('fhirVersion');
	var type = $('fhirType').toLowerCase();
	var requestURL = $('url');
	if (!requestURL.endsWith('/')) {
		requestURL += '/';
	}
	var requestURL = new java.net.URI(requestURL);

	// Add more supported parameters as you see fit
	var supportedParameters = [
		// General
		'_format',
		// All resources
		'_content',
		'_id',
		'_lastupdated',
		// Results
		'_count',
	]

	// Add more supported parameters as you see fit
	var supportedTypeParameters = {
		patient: [
			'identifier',
			'name',
			'given',
			'family'
		],
		schedule: [
			'identifier',
			'actor'
		],
		slot: [
			'identifier',
			'schedule'
		]
	}

	if (type) {
		var typeParameters = supportedTypeParameters[type.toLowerCase()];
		if (typeParameters) {
			for each (param in typeParameters) {
				supportedParameters.push(param);
			}
		}
	}

	// Uncomment this to reject requests with parameters that aren't supported
//  for each (key in $('parameters').getKeys().toArray()) {
//	  if (supportedParameters.indexOf(key.toLowerCase()+'') < 0) {
//		  return createOperationOutcome('error', 'invalid', 'Unknown or unsupported parameter ' + key + '.', fhirVersion);
//	  }
//  }

	var _content = $('parameters').getParameter('_content');

	var _id = $('parameters').getParameter('_id');

	var _lastUpdated = $('parameters').getParameter('_lastUpdated');
	var lastUpdatedOperator = 'eq';
	if (_lastUpdated) {
		try {
			if (/^(eq|ne|gt|lt|ge|le|sa|eb|ap).*/.test(_lastUpdated)) {
				lastUpdatedOperator = _lastUpdated.substr(0, 2);
				_lastUpdated = _lastUpdated.substr(2);
			}
			_lastUpdated = convertDate(_lastUpdated, 'yyyy-MM-dd HH:mm:ss.SSSZZ');
		} catch (e) {
			return createOperationOutcome('error', 'invalid', 'Parameter _lastUpdated formatted incorrectly: ' + _lastUpdated, fhirVersion);
		}
	}

	var _count = $('parameters').getParameter('_count');
	if (_count) {
		_count = parseInt(_count, 10);
		if (!_count) {
			return createOperationOutcome('error', 'invalid', 'Parameter _count formatted incorrectly: ' + $('parameters').getParameter('_count'), fhirVersion);
		}
	}

	// Build up the WHERE clause and prepared query parameters
	var whereParts = [];
	var params = [];
	
	if (type) {
		// search-type
		whereParts.push("name = ?");
		params.push(type);
	}

	// Search on the entire content of the resource
	if (_content) {
		whereParts.push(getFhirSearchContentWherePart());
		params.push('%' + _content + '%');
	}

	// Logical id of the resource
	if (_id) {
		whereParts.push("id = ?");
		params.push(_id);
	}

	// When the resource version last changed
	if (_lastUpdated) {
		whereParts.push(getFhirSearchLastUpdatedWherePart(lastUpdatedOperator));
		params.push(_lastUpdated);
	}

	// Add resource-specific query expressions
	if (type == 'patient') {
		if ($('parameters').contains('identifier')) {
			addXPath(xpathSearch('/*/identifier', ['value/@value'], $('parameters').getParameter('identifier'), true, true), whereParts, params);
		}
		if ($('parameters').contains('name')) {
			addXPath(xpathSearch('/*/name', ['family/@value', 'given/@value'], $('parameters').getParameter('name')), whereParts, params);
		}
		if ($('parameters').contains('family')) {
			addXPath(xpathSearch('/*/name', ['family/@value'], $('parameters').getParameter('family')), whereParts, params);
		}
		if ($('parameters').contains('given')) {
			addXPath(xpathSearch('/*/name', ['given/@value'], $('parameters').getParameter('given')), whereParts, params);
		}
	} else if (type == 'schedule') {
		if ($('parameters').contains('identifier')) {
			addXPath(xpathSearch('/*/identifier', ['value/@value'], $('parameters').getParameter('identifier'), true, true), whereParts, params);
		}
		if ($('parameters').contains('actor')) {
			addXPath(xpathSearch('/*/actor', ['reference/@value'], $('parameters').getParameter('actor')), whereParts, params);
		}
	} else if (type == 'slot') {
		if ($('parameters').contains('identifier')) {
			addXPath(xpathSearch('/*/identifier', ['value/@value'], $('parameters').getParameter('identifier'), true, true), whereParts, params);
		}
		if ($('parameters').contains('schedule')) {
			addXPath(xpathSearch('/*/schedule', ['reference/@value'], $('parameters').getParameter('schedule')), whereParts, params);
		}
	}

	// Build up the actual query
	var usingLimit = _count > 0;
	var query = getFhirSearchBaseQuery(usingLimit);
	if (whereParts.length > 0) {
		query += " AND " + whereParts.join(" AND ");
	}
	query = addOrder(query, usingLimit);
	if (usingLimit) {
		query = addLimit(query, _count);
	}

	var result = executeCachedQuery(query, params);
	var bundle = new Packages.org.hl7.fhir.r4.model.Bundle().setType(Packages.org.hl7.fhir.r4.model.Bundle.BundleType.SEARCHSET);

	while (result.next()) {
		var entryType = getResultSetString(result, 'name');
		var entryId = getResultSetString(result, 'id');
		var entryVersion = result.getInt('version');
		var entryData = getResultSetString(result, 'data');
		var entryContentType = getResultSetString(result, 'mimetype');
		var entryRequestMethod = getResultSetString(result, 'request_method');
		var entryRequestURL = getResultSetString(result, 'request_url');

		var resourceType = FhirUtil.getResourceType(entryType, fhirVersion);
		if (resourceType != null) {
			entryType = resourceType.getPath();
		}

		var request = new Packages.org.hl7.fhir.r4.model.Bundle.BundleEntryRequestComponent().setMethod(new Packages.org.hl7.fhir.r4.model.Bundle.HTTPVerbEnumFactory().fromCode(entryRequestMethod)).setUrl(entryRequestURL);
		var entry = bundle.addEntry().setRequest(request);
	
		var relativeUrl = type ? '' : (resourceType + '/');
		if ($('url').contains('_search') && $('method') == 'POST') {
			relativeUrl = '../' + relativeUrl;
		}
		entry.setFullUrl(requestURL.resolve(relativeUrl + entryId + '/_history/' + entryVersion).toString());
		entry.setResource(FhirUtil.fromXML(entryData, fhirVersion));
	}

	bundle.setTotal(bundle.getEntry().size());;

	var response = FhirResponseFactory.getHistoryResponse(FhirUtil.toXML(bundle, fhirVersion), 200, FhirUtil.getMIMETypeXML());
	responseMap.put('response', response);
	return response.getMessage();
} catch (e) {
	return createOperationOutcome('error', 'transient', 'Error searching resources.', fhirVersion, 500, e);
}

/**
	Creates an XPath search selector within the given base node.

	@param String base - The base path to select within.
	@param String[] nodes - An array of child nodes to select by (combined with OR operator).
	@param String value - The value to test.
	@param Boolean equals - If true, the test will be equality, otherwise it will be a contains.
	@param Boolean caseSensitive - If true, the contains test will match using case sensitivity.
	@return The built-up contains selector.
*/
function xpathSearch(base, nodes, value, equals, caseSensitive) {
	var search = base + "[";
	value = new java.lang.String(value).replaceAll("'", "''");
	if (!caseSensitive) {
		value = value.toLowerCase();
	}
	
	for (var i = 0; i < nodes.length; i++) {
		var node = convertXPathNodeSingleton(nodes[i]);
		if (!caseSensitive) {
			node = xpathLowerCase(node);
		}
		
		if (equals) {
			search += node + " = '" + value + "'";
		} else {
			search += "contains(" + node + ", '" + value + "')";
		}
		
		if (i < nodes.length - 1) {
			search += " or ";
		}
	}
	
	search += "]";
	return search;
}