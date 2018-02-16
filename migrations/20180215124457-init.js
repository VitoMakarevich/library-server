var fs = require('fs');
var path = require('path');
var filename = path.basename(__filename, '.js');
exports.up = function(db, callback) {
	fs.readFile(path.resolve(__dirname, filename + '.up.sql'), 'utf-8', function (error, data) {
		db.runSql(data, callback);
	});
};

exports.down = function(db, callback) {
	fs.readFile(path.resolve(__dirname, filename + '.down.sql'), 'utf-8', function (error, data) {
		db.runSql(data, callback);
	});
};