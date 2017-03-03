var express = require('express');
var bodyParser = require('body-parser');
var path = require ('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('met', ['students']);

var app = express();


/*
var logger = function(req,res,next){
	console.log('logging...');
	next();
}

app.use(logger);
*/

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parsing MIddleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Globally Declaring errors variable.
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

var students = [
 {
 	id : 1,
	name : 'jeff',
	age : 15
},

 {
 	id : 2,
	name :'Jack',
		age:21
	}
]


app.get('/', function(req, res){

	db.users.find(function (err, docs) {
    
    	//	console.log(docs);
			res.render('index', {
			title: 'Student Sign Up',
			users: docs
		});
    	})
    		

	//  })
});

app.post('/users/add', function(req,res){

	req.checkBody('user_name', 'Please Enter Your Username').notEmpty();
	req.checkBody('password', 'Please Enter Your Password').notEmpty();
	
	var errors = req.validationErrors();

	if(errors){
		res.render('index', {
			title: 'Student Sign Up',
			// users: users
		});
	} else {

		var newStudent = {		
			username: req.body.user_name,
			password: req.body.password	
	}
		db.users.insert(newStudent, function(err, result){

			if(err){
				console.log(err);
			}
			res.redirect('user/login');	
		})
		console.log('Congratulations, You Successfully Registered to MET Website.'); 
	}
});

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');
})
