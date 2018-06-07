/**
	These functions are used with the history interaction.
*/
function getFhirHistoryBaseQuery() {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return "SELECT name, id, version, data::TEXT, mimetype, deleted, request_method, request_url FROM resource";
	} else if (dbType == 'sqlserver') {
		return "SELECT name, id, version, CAST(data AS NVARCHAR(MAX)) AS data, mimetype, deleted, request_method, request_url FROM resource";
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}

function getFhirHistorySinceWherePart() {
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return "last_modified >= ?::TIMESTAMP WITH TIME ZONE";
	} else if (dbType == 'sqlserver') {
		return "last_modified >= CAST(? AS DATETIME)";
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}
