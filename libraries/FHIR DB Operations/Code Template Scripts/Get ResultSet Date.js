/**
	Retrives the java.util.Date value for a particular column from a ResultSet. Handles cases where the
	object returned from the ResultSet is a string.

	@param {ResultSet} resultSet - The ResultSet object to retrieve from.
	@param {String} columnName - The name or alias of the column to retrieve.
	@return {Date} The java.util.Date value.
*/
function getResultSetDate(resultSet, columnName) {
	var obj = resultSet.getObject(columnName);
	if (obj != null) {
		if (obj instanceof java.lang.String) {
			obj = getDate(obj);
		}
	}
	return obj;
}