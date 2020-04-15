/**
	Removes name / telecom / address entries with no actual value.

	@param {Object} patient - The JavaScript Object representing the FHIR Patient.
	@return {Object} The same Object passed in, cleaned up.
*/
function cleanupFhirPatient(patient) {
	// Remove names with no value
	cleanupFhirNames(patient, 'name');
	
	// Remove telecom entries with no value
	cleanupFhirTelecoms(patient, 'telecom');

	// Remove address entries with no value
	cleanupFhirAddresses(patient, 'address');

	if (patient.contact) {
		for each (contact in patient.contact) {
			if (!isFhirNameValid(contact.name)) {
				delete contact.name;
			}
			
			cleanupFhirTelecoms(contact, 'telecom');

			if (!isFhirAddressValid(contact.address)) {
				delete contact.address;
			}
		}
	}

	return patient;
}

function cleanupFhirNames(parent, property) {
	cleanupArray(parent, property, isFhirNameValid);
}

function isFhirNameValid(name) {
	return name && (!isValueEmpty(name.text) || !isValueEmpty(name.family) || !isValueEmpty(name.given) || !isValueEmpty(name.prefix) || !isValueEmpty(name.suffix));
}

function cleanupFhirTelecoms(parent, property) {
	cleanupArray(parent, property, function(telecom) {
		return !isValueEmpty(telecom.value);
	});
}

function cleanupFhirAddresses(parent, property) {
	cleanupArray(parent, property, isFhirAddressValid);
}

function isFhirAddressValid(address) {
	return address && (!isValueEmpty(address.text) || !isValueEmpty(address.line) || !isValueEmpty(address.city) || !isValueEmpty(address.state) || !isValueEmpty(address.postalCode) || !isValueEmpty(address.country));
}

function cleanupArray(parent, property, handleFunction) {
	var arr = parent[property];

	if (arr) {
		var length = arr.length;
		for (var i = length - 1; i >= 0; i--) {
			if (!handleFunction(arr[i])) {
				delete arr[i];
				length--;
			}
		}
		arr.length = length;

		// Handle Java arrays
		if (arr.length != length) {
			parent[property] = org.apache.commons.lang3.ArrayUtils.subarray(arr, 0, length);
		}
	}
}