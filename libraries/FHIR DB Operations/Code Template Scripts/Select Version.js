/**
	Returns the version ID for a given resource, or 0 if it doesn't exist.

	@param {String} type - The FHIR resource type.
	@param {String} id - The logical ID of the resource.
	@return {Number} The version ID, or 0 if the resource doesn't exist.
*/
function getFhirVersion(type, id) {
	var params = [type, id];
	var result;

	var dbType = $cfg('fhirDBDatabaseType');
	if (dbType == 'postgres') {
		result = executeCachedQuery("SELECT version FROM resource WHERE name = ? AND id = ? ORDER BY version DESC LIMIT 1", params);
	} else if (dbType == 'sqlserver') {
		result = executeCachedQuery("SELECT TOP 1 version FROM resource WHERE name = ? AND id = ? ORDER BY version DESC", params);
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
	
	if (result.next()) {
		return result.getInt(1);
	}
	return 0;
}