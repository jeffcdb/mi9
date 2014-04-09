var restify = require('restify');
//var mongojs = require("mongojs");

var ip_addr = '127.0.0.1';
var port    =  '9090';
var domain = require('domain');
var server = restify.createServer({
    name : "myapp",
	
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.jsonp());
server.use(restify.bodyParser());
server.use(restify.CORS());

function postNewJob(req,res,next)
{
//{"error": "Could not decode request: JSON parsing failed"}
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.setHeader('content-type', 'application/json');

	try{
	
	JSON.parse(req.params);
	
	var items = req.params.payload;
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
	console.log(jsondata);
	//res.send(200, JSON.stringify(req.params));
	//console.log("postNewJob");
	//console.log(items);
	res.end(JSON.stringify(jsondata));
	//res.end();
	return next();
	}catch(e)
	{
	    var err = {"error": "Could not decode request: JSON parsing failed"};
		console.log(err);
		res.end(JSON.stringify(err));
		
	}
}


var PATH = '/jobs';
//server.get('/', findAllJobs);
//server.get({path : PATH , version : '0.0.1'} , findAllJobs);
//server.get({path : PATH +'/:jobId' , version : '0.0.1'} , findJob);
server.post('/' ,postNewJob);
//server.del({path : PATH +'/:jobId' , version: '0.0.1'} ,deleteJob);

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});



