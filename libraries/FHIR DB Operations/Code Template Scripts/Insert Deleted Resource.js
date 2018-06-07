/**
	Inserts a deleted entry for a resource and returns its DB sequence ID.

	@param {String} type - The FHIR resource type.
	@param {String} id - The logical ID of the resource.
	@param {Number} versionId - The version ID of the resource.
	@param {Date} lastUpdated - The last updated time of the resource.
	@param {String} method - The HTTP method used to create the resource.
	@param {String} url - The HTTP URL used to create the resource.
	@return {Number} The database sequence ID for the inserted resource.
*/
function insertFhirDeletedResource(type, id, versionId, lastUpdated, method, url) {
	var dbType = $cfg('fhirDBDatabaseType');

	if (dbType == 'postgres') {
		var params = [type, id, versionId, lastUpdated, $('method'), $('url')];
		var result = executeUpdateAndGetGeneratedKeys("INSERT INTO resource (name, id, version, last_modified, deleted, request_method, request_url) VALUES (?, ?, ?, ?, TRUE, ?, ?)", params);
		result.next();
		return result.getInt(1);
	} else if (dbType == 'sqlserver') {
		var dbConn = createFHIRDBConnection();
		
		try {
			dbConn.setAutoCommit(false);
			
			var idResult = executeCachedQuery('SELECT id FROM resource_sequence WITH (UPDLOCK)', [], dbConn);
			idResult.next();
			var sequenceId = idResult.getInt(1);
			executeUpdate('UPDATE resource_sequence SET ID = ID + 1', [], dbConn);
			dbConn.commit();

			var params = [sequenceId, type, id, versionId, lastUpdated, $('method'), $('url')];
			executeUpdate("INSERT INTO resource (sequence_id, name, id, version, last_modified, deleted, request_method, request_url) VALUES (?, ?, ?, ?, ?, 1, ?, ?)", params, dbConn);
			dbConn.commit();
			
			return sequenceId;
		} catch (e) {
			try { dbConn.rollback() } catch (e2) {}
			throw e;
		} finally {
			try { dbConn.close() } catch (e) {}
		}
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}