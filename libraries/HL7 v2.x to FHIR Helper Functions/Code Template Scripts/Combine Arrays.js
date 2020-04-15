/**
	Combines two arrays into one. Works with both Java and JavaScript arrays.

	@param {Array} array1 - The first array.
	@param {Array} array2 - The second array.
	@return {Array} The combined array.
*/
function combineArrays(array1, array2) {
	var isJavaArray1 = Object.prototype.toString.call(array1) == '[object JavaArray]';
	var isJavaArray2 = Object.prototype.toString.call(array2) == '[object JavaArray]';

	if (isJavaArray1 && isJavaArray2) {
		return org.apache.commons.lang3.ArrayUtils.addAll(array1, array2);
	} else if (isJavaArray1) {
		for (var i = array1.length - 1; i >= 0; i--) {
			array2.unshift(array1[i]);
		}
		return array2;
	} else {
		for each (value in array2) {
			array1.push(value);
		}
		return array1;
	}
}