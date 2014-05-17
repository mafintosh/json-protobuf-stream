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

	var schema = typeof headers.mergeFromObject === 'function' && typeof headers.encode === 'function' ? headers : protobuf(headers);
	var s = through.obj({highWaterMark:16}, function(data, enc, cb) {
		var status = schema.mergeFromObject(data);
		if (status === -1) return cb(new Error('Schema mismatch'));
		if (!status) {
			s.push(schema.encode(data));
			return cb();
		}

		s.push(schema.encode(data));
		s.emit('update', cb) || cb();
	});

	s.schema = schema.toJSON();

	return s;
};