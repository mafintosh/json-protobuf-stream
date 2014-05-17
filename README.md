# json-protobuf-stream

Encode json to protobuf as a stream

	npm install json-protobuf-stream

## Usage

``` js
var jsonProtobuf = require('json-protobuf-stream');

var encoder = jsonProtobufStream();

encoder.on('update', function(callback) {
	console.log('schema has changed', encoder.schema.toJSON());
	callback();
});

encoder.on('data', function(data) {
	console.log('json encoded as protobuf: '+data);
});

encoder.write({hello:'world'});
```

## License

MIT