var express = require('express');
var bodyparser = require('body-parser');
var app = express();

app.set("view engine", 'jade');
var store = {
	home: {
		page: "Main Page",
		content: "Hello world"
	},
	about: {
		page: "About",
		content: "Some words about me"
	},
	dowloads: {
		page: "Downloads",
		content: "Download all staff"
	},
	profile: {
		page: "Profile",
		content: "Your personal pofile"
	},
}
var error = {
	page: "404 Not found",
	content: "Sorry, the requested page is not found"
}
app.use(bodyparser.urlencoded({extended: true}));
var storeKeys = Object.keys(store);

app.get('/about', function(req, res){
	res.render("about", {
		page: "About",
		links: storeKeys
	});
})

app.route('/form')
	.get(function(req, res){
		res.render("form", {
			page: 'Contact Form',
			links: storeKeys
		})
	})
	.post(function(req, res){
		var data = req.body;
		if(data.pageurl && data.pagename && data.pagecontent){
			store[data.pageurl] = {
				page: data.pagename,
				content: data.pagecontent
			}
			storeKeys = Object.keys(store);
		}
		res.redirect("/");
	})
app.get('/:page?', function(req, res){
	var page = req.params.page, data;
	if (!page) {page = 'home';}
	data = store[page];
	if (!data) {
		page = 'error';
		data = error;
	}
	data.links = storeKeys;
	res.render("main", data);
})
app.use(function(req, res, next){
	console.log("%s %s", req.method, req.url);
	next();
});

app.use(express.static(__dirname + '/public'))
var server = app.listen(3000, function(){
	console.log("Listen on port 3000");
})