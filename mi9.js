var restify = require('restify');
//var logfmt = require('logfmt');
var ip_addr = '127.0.0.1';
var port =  process.env.PORT || 5000;
var domain = require('domain');
var d = domain.create();
var server = restify.createServer({
formatters:
{
    'application/json': function formatFoo(req, res, body) {
      if (body instanceof Error){
		console.log("err");
		var err = {"error": "Could not decode request: JSON parsing failed"};
		console.log(JSON.stringify(err));
		res.statusCode = 400;
        //return body.stack;
		return (JSON.stringify(err));
		}

		console.log("err");
      if (Buffer.isBuffer(body))
        return body.toString('base64');

      return body;
    }
  }
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.bodyParser());
server.use(restify.CORS());

function Mi9test(req,res,next)
{
	try{
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		res.setHeader('content-type', 'application/json');

		var r = req.is('application/json');
		console.log(r);

		var items = req.params.payload;
		console.log(req.params);
		var results = new Array();
		var result = {};
		items.filter(function(item){
			if (item.drm && (item.episodeCount > 0)) {
				var result = {
					"image": item.image.showImage,
					"slug": item.slug,
					"title":item.title
				};
				results.push(result);
			}
		});	
		var jsondata = {"response":results};
		//console.log(JSON.stringify(jsondata));
		res.end(JSON.stringify(jsondata));
		return next();
	}
	catch(e)
	{
		var err = {"error": "Could not decode request: JSON parsing failed"};
		console.log(JSON.stringify(err));
		res.statusCode = 400;
		res.send(err);
	}
}

server.post('/' ,Mi9test);

server.listen(port ,function(){
	console.log("Listening on " + port);
    //console.log('%s listening at %s ', server.name , server.url);
});
