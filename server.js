var connect = require('connect');
var serveStatic = require('serve-static');
var app = connect();
var staticPath = "C:/Users/V823367/Documents/app-youtube"
var port = 9000;

//app.use(serveStatic.logger('dev'));

app.use(serveStatic(staticPath))
.listen(port, function() {
	console.log("server listening at port: " + port);
});