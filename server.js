var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require("./db.js");

var app = express();

var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextID = 1;

app.use(bodyParser.json());

// GET...

app.get('/', function(req, res){
	res.send("Todo API Root");
})

// GET WITH QUERY FILTERS...

app.get('/todos', function(req,res){
	var query = req.query;
	var where = {};
	
	if(query.hasOwnProperty('completed') && query.completed === 'true'){
		where.completed = true;
	}else if(query.hasOwnProperty('completed') && query.completed === 'false'){
		where.completed = false;
	}
	
	if(query.hasOwnProperty("q") && query.q.length > 0){
		where.description = {
			$like: "%" + query.q + "%"
		};
	}
	
	db.todo.findAll({where: where}).then(function(todos){
		res.json(todos);
	}, function(e){
		res.status(500).send();
	});
	
	/*var filteredTodos = todos;
	
	if(queryParams.hasOwnProperty("completed") && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true});
	}else if(queryParams.hasOwnProperty("completed") && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	
	if(queryParams.hasOwnProperty("q") && queryParams.q.length > 0){
		filteredTodos = _.filter(filteredTodos, function(todo){
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}	
	res.json(filteredTodos);*/
	
	
});

// SEQUELIZED GET...
app.get("/todos/:id", function(req,res){
	var todoId = parseInt(req.params.id,10);
	/*var matchedTodo = _.findWhere(todos,{id: todoId});
	
	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}*/
	
	db.todo.findById(todoId).then(function(todo){
		if(!!todo){
			res.json(todo.toJSON());
		}else{
			res.status(404).send();
		}
	}, function(e){
			res.status(500).send();
	});
});

// POST...

app.post("/todos", function(req,res){
	var body = _.pick(req.body, "description", "completed");
	
	db.todo.create(body).then(function(todo){
		res.json(todo.toJSON());
	}, function(e){
		res.status(400).json(e);
	});
	
	/*if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send();
	}
	
	body.description = body.description.trim();
	body.id = todoNextID;
	todos.push(body);
	todoNextID++;
	
	res.json(body);*/
});


// DELETE...

	app.delete("/todos/:id", function(req,res){
		var todoId = parseInt(req.params.id, 10);
		
		db.todo.destroy({
			where:{
				id: todoId
			}
		}).then(function(rowsDeleted){
			if(rowsDeleted === 0){
				res.status(404).json({
					error: "no todo with id..."
				})
			}else{
				res.status(204).send();
			}
		}, function(){
			res.status(500).send();
		})
		
		/*var matchedTodo = _.findWhere(todos,{id: todoId});
		
		if(!matchedTodo){
			res.status(404).json({"error": "no todo found with that id"});
		}else{
			todos = _.without(todos, matchedTodo);
			res.json(matchedTodo);
		}*/
	});


// PUT [UPDATE]...

		app.put('/todos/:id', function(req,res){
			var body = _.pick(req.body, "description", "completed");
			var attributes = {};		
			var todoId = parseInt(req.params.id, 10);
					
			if(body.hasOwnProperty('completed')){
				attributes.completed = body.completed;
			}

			if(body.hasOwnProperty("description")){
				attributes.description = body.description;
			}
			
			db.todo.findById(todoId).then(function(todo){
				if(todo){
					todo.update(attributes).then(function(todo){
						res.json(todo.toJSON());
			},function(e){
				res.status(400).json(e);
			})
				}else{
					res,status(404).send();
				}
			}, function(){
				res.status(500).send();
			});				
		});
		
		app.post("/users", function(req,res){
			var body = _.pick(req.body, "email", "password");
			
			db.user.create(body).then(function(user){
				res.json(user.toPublicJSON());
			}, function(e){
				res.status(400).json(e);
			});
		})
		
	// DATABASE...
	
	db.sequelize.sync().then(function(){
		app.listen(PORT, function(){
			console.log("Express listening on port " + PORT + "!");
		})
	})
	

/*app.listen(PORT, function(){
	console.log("Express listening on port " + PORT);
})*/












