/**
	Executes an INSERT/UPDATE statement on the database and returns a CachedRowSet containing any
	generated keys.

	@param {String} expression - The prepared statement to be executed.
	@param {Array} parameters - The parameters for the prepared statement.
	@param {DatabaseConnection} dbConn - Optionally provide a specific connection object.
	@return {CachedRowSet} A CachedRowSet containing any generated keys.
*/
function executeUpdateAndGetGeneratedKeys(expression, parameters, dbConn) {
	return executeOperation('executeUpdateAndGetGeneratedKeys', expression, parameters, dbConn);
}