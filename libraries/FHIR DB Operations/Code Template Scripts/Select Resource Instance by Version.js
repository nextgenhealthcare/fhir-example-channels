/**
	Returns a ResultSet for a specific resource instance at a specific version.

	@param {String} type - The FHIR resource type.
	@param {String} id - The logical ID of the resource.
	@param {Number} versionId - The version ID of the resource.
	@return {ResultSet} The ResultSet.
*/
function getResourceVersion(type, id, versionId) {
	var params = [type, id, parseInt(versionId, 10)];
	var dbType = $cfg('fhirDBDatabaseType');

	if (dbType == 'postgres') {
		return executeCachedQuery("SELECT data::TEXT, mimetype, last_modified, deleted FROM resource WHERE name = ? AND id = ? AND version = ?", params);
	} else if (dbType == 'sqlserver') {
		return executeCachedQuery("SELECT CAST(data AS NVARCHAR(MAX)) AS data, mimetype, last_modified, deleted FROM resource WHERE name = ? AND id = ? AND version = ?", params);
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}