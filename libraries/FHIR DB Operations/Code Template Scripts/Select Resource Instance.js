/**
	Returns a ResultSet for a specific resource instance.

	@param {String} type - The FHIR resource type.
	@param {String} id - The logical ID of the resource.
	@return {ResultSet} The ResultSet.
*/
function getResource(type, id) {
	var params = [type, id];
	var dbType = $cfg('fhirDBDatabaseType');

	if (dbType == 'postgres') {
		return executeCachedQuery("SELECT version, data::TEXT, mimetype, last_modified, deleted FROM resource WHERE name = ? AND id = ? ORDER BY version DESC LIMIT 1", params);
	} else if (dbType == 'sqlserver') {
		return executeCachedQuery("SELECT TOP 1 version, CAST(data AS NVARCHAR(MAX)) AS data, mimetype, last_modified, deleted FROM resource WHERE name = ? AND id = ? ORDER BY version DESC", params);
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}