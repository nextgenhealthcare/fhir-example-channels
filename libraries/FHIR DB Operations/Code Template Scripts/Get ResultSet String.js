/**
	Retrives the string value for a particular column from a ResultSet. Handles instances of
	java.sql.Clob and java.sql.Blob as well (with the JVM default charset).

	@param {ResultSet} resultSet - The ResultSet object to retrieve from.
	@param {String} columnName - The name or alias of the column to retrieve.
	@return {String} The string value.
*/
function getResultSetString(resultSet, columnName) {
	var obj = resultSet.getObject(columnName);
	if (obj != null) {
		if (obj instanceof java.sql.Clob) {
			obj = org.apache.commons.io.IOUtils.toString(obj.getCharacterStream());
		} else if (obj instanceof java.sql.Blob) {
			obj = org.apache.commons.io.IOUtils.toString(obj.getBinaryStream());
		} else {
			obj = java.lang.String.valueOf(obj);
		}
	}
	return obj;
}