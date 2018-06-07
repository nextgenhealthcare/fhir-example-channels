/**
	Executes a prepared query on the FHIR database and returns a CachedRowSet.

	@param {String} expression - The prepared statement to be executed.
	@param {Array} parameters - The parameters for the prepared statement.
	@param {DatabaseConnection} dbConn - Optionally provide a specific connection object.
	@return {CachedRowSet} The result of the query, as a CachedRowSet.
*/
function executeCachedQuery(expression, parameters, dbConn) {
	return executeOperation('executeCachedQuery', expression, parameters, dbConn);
}