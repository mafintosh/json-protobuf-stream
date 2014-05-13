var through = require('through2');
var protobuf = require('protocol-buffers');

var getType = function(val) {
	if (Buffer.isBuffer(val)) return 'bytes';
	var t = typeof val;
	if (t === 'boolean') return 'bool';
	if (t === 'number') return 'double';
	if (t === 'object') return 'json';
	return t;
};

module.exports = function(headers) {
	if (!headers) headers = [];

	var schema = protobuf(headers);
	var index = {};

	headers.forEach(function(header, i) {
		index[header.name] = header.tag || i;
	});

	var s = through.obj({highWaterMark:16}, function(data, enc, cb) {
		var keys = Object.keys(data);
		var updated = false;

		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];

			if (data[key] === undefined || data[key] === null) continue;
			if (index[key]) continue;

			index[key] = {
				name:key,
				tag:headers.length,
				type:getType(data[key])
			};

			headers.push(index[key]);
			updated = true;
		}

		if (!updated) {
			s.push(schema.encode(data));
			return cb();
		}

		schema = protobuf(headers);
		s.push(schema.encode(data));

		s.emit('schema', headers, cb) || cb();
	});

	s.schema = headers;

	return s;
};