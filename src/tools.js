// -- Object tools --

// has(obj, key) - Does the object contain the given key?
var has = Function.call.bind(Object.prototype.hasOwnProperty);

// extend(obj, a, b, c, ...) - Add the properties of other objects to this
// object
function extend(obj)
{
	for (var i = 1, max = arguments.length; i < max; i ++)
		for (var key in arguments[i])
			if (has(arguments[i], key))
				obj[key] = arguments[i][key];

	return obj;
}

// merge(a, b, c, ...) - Create an object with the merged properties of other
// objects
function merge()
{
	return extend.bind(null, {}).apply(null, arguments);
}

var copy = merge;

// -- Array tools --

// arrayify(a) - Turn an array-like object into an array
var slice = Function.call.bind(Array.prototype.slice),
    arrayify = slice;

// index(on, a) - Index an array of objects by a key
function index(on, a)
{
	var obj = {};

	for (var i = 0, max = a.length; i < max; i ++)
		if (a[i].has(on))
			obj[a[i][on]] = a[i];

	return obj;
}

// pluck(on, a) - Return a list of property values
function pluck(on, a)
{
	return a.map(function(o) { return o[on]; });
}

// indexpluck(on, a) - Index and pluck
function indexpluck(key, value, a)
{
	var obj = {};

	for (var i = 0, max = a.length; i < max; i ++)
		if (a[i].has(key))
			obj[a[i][key]] = a[i][value];

	return obj;
}

// equi(on, a, b, c, ...) - Performs a equijoin on all the objects in the given
// arrays
function equi(on)
{
	var obj = {}, ret = [];

	for (var i = 1, imax = arguments.length; i < imax; i ++)
		for (var j = 0, jmax = arguments[i].length; j < jmax; j ++)
			if (has(arguments[i][j], on))
				obj[arguments[i][j][on]] = merge(obj[arguments[i][j][on]] || {}, arguments[i][j])

	for (var prop in obj)
		if (has(obj, prop))
			ret.push(obj[prop]);

	return ret;
}

// -- URI tools --

// decodeURIPlus(str) - Decode a URI component, including conversion from '+'
// to ' '
function decodeURIPlus(str)
{
	return decodeURIComponent(str.replace(/\+/g, " "));
}

// decodeURIPlus(str) - Encode a URI component, including conversion from ' '
// to '+'
function encodeURIPlus(str)
{
	return encodeURIComponent(str).replace(/ /g, "+");
}

// decodeQuery(query) - Convert a query string to an object
function decodeQuery(query)
{
	var obj = {};

	query.split("&").forEach(function(str) {
		var m = str.match(/^([^=]*)=(.*)$/);

		if (m)
			obj[decodeURIPlus(m[1])] = decodeURIPlus(m[2]);
		else
			obj[decodeURIPlus(str)] = "";
	});

	return obj;
}

// encodeQuery(query) - Convert a query string back into a URI
function encodeQuery(query)
{
	var components = [];

	for (var name in query)
		if (has(query, name))
			components.push(encodeURIPlus(name) + "=" + encodeURIPlus(query[name]));

	return components.join("&");
}

// URI(uri) - Convert a URI to a mutable object
function URI(uri)
{
	if (!(this instanceof URI))
		return new URI(uri);

	var m = uri.match(/([^\/]+)\/\/([^\/]+)([^?]*)(?:\?(.+))?/);

	if (m)
	{
		this.protocol = m[1];
		this.host = m[2];
		this.pathname = m[3];
		this.query = m[4] ? decodeQuery(m[4]) : {};
	}
	else
	{
		this.href = uri;
		this.query = {};
	}
}
URI.prototype.toString = function() {
	if (this.href)
		return this.href;

	var encq = this.query && encodeQuery(this.query);

	return (this.protocol || "http") + "//" + this.host + this.pathname + (encq ? "?" + encq : "");
};

// -- Function tools --

function identity(a) { return a; }

// runWith - Run JavaScript code with an object's properties as local variables
function runWith(str, obj)
{
	var names = [],
	    values = [];

	for (var name in obj)
		if (has(obj, name))
		{
			names.push(name);
			values.push(obj[name]);
		}

	var func = Function.apply(null, names.concat(str));

	return func.apply(null, values);
}

// -- String tools --

// format(str, obj) - Formats a string with a syntax similar to Python template
// strings, except the identifiers are executed as JavaScript code.
function format(str, obj)
{
	return str.replace(/\${([^}]+)}/g, function(match, name) {
		try {
			return runWith("return (" + name + ");", obj);
		}
		catch (e) {
			return match;
		}
	});
}

// trim(str) - Trims whitespace from the start and end of the string.
function trim(str)
{
	return str.replace(/^\s+/, "").replace(/\s+$/, "");
}

// formatFileName(str) - Formats a file name (sans extension) to obey certain
// restrictions on certain platforms. Makes room for a 4 character extension,
// ie. ".webm".
function formatFileName(str)
{
	return str
		.replace(/[\\/<>:"\?\*\|]/g, "-")
		.replace(/[\x00-\x1f]/g, "-")
		.replace(/^\./g, "-")
		.replace(/^\s+/, "")
		.substr(0, 250);
}
