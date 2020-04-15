/**
	Returns the "return" element of the Prefer HTTP header if specified.

	@return {String} The "return" element of the Prefer header, or undefined if not present
*/
function getPreferValue() {
	var preferReturn;
	var preferHeader = $('headers').getHeader('Prefer');
	
	if (preferHeader) {
		for each (element in new org.apache.http.message.BasicHeader('Prefer', preferHeader).getElements()) {
			if (element.getName() == 'return') {
				preferReturn = element.getValue();
				break;
			}
		}
	}
	
	return preferReturn;
}