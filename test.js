var encoder = require('./')([{
	name: 'hello',
	type: 'string',
	tag: 1
}]);


encoder.on('data', function(data) {
	console.log(require('protocol-buffers')(encoder.schema).decode(data));
});

encoder.write({hello:'world'})
encoder.write({hello:'world', world:'meh', foo:'bar', bar:{hello:'world'}})