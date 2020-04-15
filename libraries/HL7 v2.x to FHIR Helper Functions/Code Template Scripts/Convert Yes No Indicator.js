/**
	Converts an HL7 v2.x yes/no indicator code to a boolean value. If the code is null or an empty string,
	false will be returned.

	@param {String} code - The HL7 yes/no indicator (Table 0136)
	@return {Boolean} True/false
*/
function convertYesNoIndicator(code) {
	return code == 'Y';
}