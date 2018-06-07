/**
	Executes a prepared INSERT/UPDATE statement on the database and returns the row count.

	@param {String} expression - The prepared statement to be executed.
	@param {Array} parameters - The parameters for the prepared statement.
	@param {DatabaseConnection} dbConn - Optionally provide a specific connection object.
	@return {int} A count of the number of updated rows.
*/
function executeUpdate(expression, parameters, dbConn) {
	return executeOperation('executeUpdate', expression, parameters, dbConn);
}