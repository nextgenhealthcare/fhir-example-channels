/**
	Supports parsing date strings in a variety of formats and outputting the date in a specific format.
*/
var patterns = [
	"yyyy-MM-dd HH:mm:ss.SSSSSSS ZZ",
	"yyyy-MM-dd'T'HH:mm:ss.SSSZ",
	"yyyy-MM-dd'T'HH:mm:ssZ",
	"yyyy-MM-dd'T'HH:mm:ss",
	"yyyy-MM-dd'T'HH:mm",
	'yyyy-MM-dd',
	'yyyy-MM-dd HH:mm:ss:SSS',
	'yyyy-MM-dd HH:mm:ss.SSS',
	'yyyy-MM-dd HH:mm:ss',
	'yyyy-MM-dd HH:mm',
	'EEE MMM dd HH:mm:ss:SSS zzz yyyy',
	'EEE MMM dd HH:mm:ss.SSS zzz yyyy',
	'EEE MMM dd HH:mm:ss zzz yyyy',
	'EEE MMM dd zzz yyyy',
	'dd-MMM-yyyy HH:mm:ss:SSS',
	'dd-MMM-yyyy HH:mm:ss.SSS',
	'dd-MMM-yyyy HH:mm:ss',
	'yyyy MM dd',
	'yyyy.MM.dd',
	'MM-dd-yyyy',
	'MM dd yyyy',
	'MM.dd.yyyy',
	'HH:mm:ss:SSS',
	'HH:mm:ss.SSS',
	'HH:mm:ss',
	'yyyyMMddHHmmssSSS',
	'yyyyMMddHHmmss',
	'yyyyMMddHHmm',
	'hh:mm aa'];

var formatters = [];
for each (pattern in patterns) {
	formatters.push(org.joda.time.format.DateTimeFormat.forPattern(pattern));
}

function getMillis(date) {
	var instant = 0;
	if (typeof date == 'number' || date instanceof java.lang.Number)
		instant = new Number(date);
	else if (date instanceof Date || date instanceof java.util.Date)
		instant = date.getTime();
	else if (date instanceof org.joda.time.ReadableInstant)
		instant = date.getMillis();
	else {
		for each (formatter in formatters) {
			try {
				instant = formatter.parseMillis(new String(date));
				break;
			} catch(e) {}
		}
	}

	return instant;
}

function getDate(date) {
	return new java.util.Date(getMillis(date));
}

function convertDate(date, outpattern) {
	return org.joda.time.format.DateTimeFormat.forPattern(outpattern).print(getMillis(date));
}