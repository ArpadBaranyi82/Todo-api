var express = require("express");
var app = express();

var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: "First task",
	completed: false
},
{
	id: 2,
	description: "Second task",
	completed: false
},
{
	id: 3,
	description: "Third task",
	completed: true
},
];

app.get('/', function(req, res){
	res.send("Todo API Root");
})

app.get('/todos', function(req,res){
	res.json(todos);
});

app.get("/todos/:id", function(req,res){
	var todoId = parseInt(req.params.id,10);
	var matchedTodo;
	
	for(var i = 0; i < todos.length;i++){
		if(todos[i].id === todoId){
			matchedTodo = todos[i];
		}
	};
	
	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send();
	}
	
});

app.listen(PORT, function(){
	console.log("Express listening on port " + PORT);
})