/**
	Removes empty strings, objects and arrays from a JavaScript object.

	@param {Object/Array} obj - The object or array to consolidate.
	@return {Object/Array} The consolidates object or array.
*/
function consolidate(obj) {
	if (typeof obj != 'undefined' && obj != null) {
		var protoToString = Object.prototype.toString.call(obj);
		var isJavaArray = protoToString == '[object JavaArray]';
		var isArray = isJavaArray || obj instanceof Array || protoToString == '[object Array]';
		
		if (isArray) {
			for (var i = obj.length - 1; i >= 0; i--) {
				if (!doConsolidate(obj, i)) {
					if (isJavaArray) {
						var a1 = org.apache.commons.lang3.ArrayUtils.subarray(obj, 0, i);
						var a2 = org.apache.commons.lang3.ArrayUtils.subarray(obj, i + 1, obj.length);
						obj = org.apache.commons.lang3.ArrayUtils.addAll(a1, a2);
					} else {
						obj.splice(i, 1);
					}
				}
			}
		} else if (protoToString == '[object Object]') {
			for (var property in obj) {
				doConsolidate(obj, property);
			}
		}
	}
	return obj;
}

function doConsolidate(obj, property) {
	var value = obj[property] = consolidate(obj[property]);
	var empty = isValueEmpty(value);
	if (empty) {
		delete obj[property];
	}
	return !empty;
}

function isValueEmpty(value) {
	var protoToString = Object.prototype.toString.call(value);

	if (typeof value == 'undefined' || value == null) {
		return true;
	} else if (value instanceof Array || protoToString == '[object Array]' || protoToString == '[object JavaArray]') {
		if (value.length > 0) {
			for each (element in value) {
				if (!isValueEmpty(element)) {
					return false;
				}
			}
		}
		return true;
	} else if (typeof value == 'string' || protoToString == '[object String]') {
		return value.length == 0;
	} else if (value instanceof java.lang.String) {
		return org.apache.commons.lang3.StringUtils.isEmpty(value);
	} else if (protoToString == '[object Object]') {
		for (var property in value) {
			if (!isValueEmpty(value[property])) {
				return false;
			}
		}
		return true;
	}

	return false;
}
