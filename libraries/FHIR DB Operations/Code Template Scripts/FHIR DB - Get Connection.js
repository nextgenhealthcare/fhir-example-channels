/**
	Retrieves the FHIR database connection from the global channel map, creating a new one if necessary.

	@param {Boolean} recreate - If true, the connection will always be closed and created anew.
	@return {DatabaseConnection} The database connection object.
*/
function getFHIRDBConnection(recreate) {
	var dbConn = $gc('dbConn');

	if (!dbConn || recreate) {
		if (dbConn) {
			try {
				dbConn.close();
			} catch (e) {}
		}
		dbConn = createFHIRDBConnection();
		$gc('dbConn', dbConn);
	}

	return dbConn;
}

function createFHIRDBConnection() {
	return DatabaseConnectionFactory.createDatabaseConnection($('fhirDBDriver'), $('fhirDBUrl'), $('fhirDBUsername'), $('fhirDBPassword'));
}

function executeOperation(operation, expression, parameters, dbConn) {
	var createDbConn = typeof dbConn == 'undefined';
	if (createDbConn) {
		dbConn = getFHIRDBConnection();
	}
	var attempts = 0;
	var maxAttempts = NumberUtils.toInt($('fhirDBMaxRetries') + '', 0) + 1;

	while (attempts < maxAttempts) {
		attempts++;

		try {
			if (parameters) {
				for (var i in parameters) {
					var param = parameters[i];
					if (param instanceof Number) {
						parameters[i] = new java.lang.Integer(param);
					} else if (param instanceof java.util.Date) {
						parameters[i] = convertDateParameter(param);
					}
				}
				
				return dbConn[operation](expression, java.util.Arrays.asList(parameters));
			} else {
				return dbConn[operation](expression);
			}
		} catch (e) {
			logger.info('Error executing statement, checking if valid...');
			var throwException = false;

			try {
				dbConn.executeCachedQuery('SELECT 1');
			} catch (e2) {
				if (createDbConn) {
					logger.info('Connection invalid, recreating...');
	
					try {
						dbConn = getFHIRDBConnection(true);
					} catch (e3) {
						throwException = true;
					}
				} else {
					throwException = true;
				}
			}

			if (attempts >= maxAttempts) {
				throwException = true;
			}

			if (throwException) {
				var errorMessage = 'Unable to execute statement.\n';
				errorMessage += 'Expression: ' + expression + '\n';
				if (parameters) {
					errorMessage += 'Parameters: ' + java.util.Arrays.asList(parameters).toString();
				}
				logger.error(errorMessage, e.javaException);
				throw e;
			}

			java.lang.Thread.sleep(1000);
		}
	}
}

function convertDateParameter(date) {
	var dbType = $cfg('fhirDBDatabaseType');

	if (dbType == 'postgres') {
		return new java.sql.Timestamp(date.getTime());
	} else if (dbType == 'sqlserver') {
		return convertDate(date, 'yyyy-MM-dd HH:mm:ss.SSSZZ');
	} else {
		throw 'Unsupported DB type: ' + dbType;
	}
}