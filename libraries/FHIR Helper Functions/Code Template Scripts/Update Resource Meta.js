/**
	Sets the resource ID, version ID, and last updated date/time.

	@param {IBaseResource} resource - The FHIR resource object.
	@param {String} id - The logical ID of the resource.
	@param {Number} versionId - The version ID of the resource.
	@return {Date} The last updated date/time.
*/
function updateResourceMeta(resource, id, versionId) {
	resource.setId(id);
	resource.getMeta().setVersionId(new String(versionId));
	var lastUpdated = new java.util.Date();
	resource.getMeta().getLastUpdatedElement().setTimeZone(java.util.TimeZone.getDefault());
	resource.getMeta().setLastUpdated(lastUpdated);
	return lastUpdated;
}