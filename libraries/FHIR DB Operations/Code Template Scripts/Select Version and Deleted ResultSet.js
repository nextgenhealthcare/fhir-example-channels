/**
	Returns a ResultSet with the version and deleted flag for a given resource.

	@param {String} type - The FHIR resource type.
	@param {String} id - The logical ID of the resource.
	@return {ResultSet} The ResultSet.
*/
function getFhirVersionAndDeleted(type, id) {
	var params = [type, id];
	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		return executeCachedQuery("SELECT version, deleted FROM resource WHERE name = ? AND id = ? ORDER BY version DESC LIMIT 1", params);
	} else if (dbType == 'sqlserver') {
		return executeCachedQuery("SELECT TOP 1 version, deleted FROM resource WHERE name = ? AND id = ? ORDER BY version DESC", params);
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}