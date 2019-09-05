require('@babel/register')({
	presets: [ '@babel/preset-env' ]
});
require('@babel/polyfill'); // for async/await

module.exports = require('./app.js');
