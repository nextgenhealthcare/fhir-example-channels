/**
	These functions are used with the search interaction.
*/
function getFhirSearchBaseQuery(usingLimit) {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return "SELECT name, id, version, data::TEXT, mimetype, request_method, request_url FROM resource r1 WHERE version = (SELECT MAX(version) FROM resource r2 WHERE r2.name = r1.name AND r2.id = r1.id) AND (deleted IS NULL OR deleted = FALSE)";
	} else if (dbType == 'sqlserver') {
		var query = "SELECT name, id, version, CAST(data AS NVARCHAR(MAX)) AS data, mimetype, request_method, request_url";
		if (usingLimit) {
			query += ", ROW_NUMBER() OVER (" + getOrderClause() + ") AS ROWNUM";
		}
		return query + " FROM resource r1 WHERE version = (SELECT MAX(version) FROM resource r2 WHERE r2.name = r1.name AND r2.id = r1.id) AND (deleted IS NULL OR deleted = 0)";
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function getFhirSearchContentWherePart() {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return "data::TEXT ILIKE ?";
	} else if (dbType == 'sqlserver') {
		return "UPPER(CAST(data AS NVARCHAR(MAX))) LIKE UPPER(?)";
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function getFhirSearchLastUpdatedWherePart(lastUpdatedOperator) {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return "last_modified " + convertFhirParameterOperator(lastUpdatedOperator) + " ?::TIMESTAMP WITH TIME ZONE";
	} else if (dbType == 'sqlserver') {
		return "last_modified " + convertFhirParameterOperator(lastUpdatedOperator) + " CAST(? AS DATETIMEOFFSET)";
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function convertFhirParameterOperator(operator) {
	switch ((operator + '').toLowerCase()) {
		case 'eq': return '=';
		case 'ne': return '!=';
		case 'gt': return '>';
		case 'lt': return '<';
		case 'ge': return '>=';
		case 'le': return '<=';
		case 'sa': return '>';
		case 'eb': return '<';
		case 'ap': return '=';
		default: return '=';
	}
}

function convertXPathNodeSingleton(node) {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return node;
	} else if (dbType == 'sqlserver') {
		return node.split('/').join('[1]/');
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function xpathLowerCase(value) {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return "translate(" + value + ", 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')";
	} else if (dbType == 'sqlserver') {
		return "fn:lower-case(" + value + ")";
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function getFhirSearchXPathWherePart() {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return "XPATH_EXISTS(?, data)";
	} else if (dbType == 'sqlserver') {
		return "data.exist(?) = 1";
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function addXPath(xpath, whereParts, params) {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		whereParts.push(getFhirSearchXPathWherePart());
		params.push(xpath);
	} else if (dbType == 'sqlserver') {
		whereParts.push(getFhirSearchXPathWherePart().replace('?', "'" + xpath.replace(/'/g, "''") + "'"));
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function addOrder(query, usingLimit) {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return query + " " + getOrderClause();
	} else if (dbType == 'sqlserver') {
		if (usingLimit) {
			return query;
		} else {
			return query + " " + getOrderClause();
		}
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function getOrderClause() {
	return "ORDER BY name ASC, id ASC, version DESC";
}

function addLimit(query, limit) {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return query + " LIMIT " + limit;
	} else if (dbType == 'sqlserver') {
		return "SELECT A.* FROM (" + query + ") AS A WHERE A.ROWNUM <= " + limit;
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}
