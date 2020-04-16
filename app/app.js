/*
*
*Created by Renz Carlo Salanga
*Github: thekingrenz23
*
*/

//Express Config
const express = require('express')
const port = 8000
const app = express()

//MongoConfig
const db = require('./db')

//Body Parser Config
const bodyParser = require('body-parser')

//Utils
const utils = require('./utils')

//template
function Result(){
	
	//Insert Response
	this.insert = {
		"success":true,
		"message": "success",
		"data": [],
	}
	
	//Get Response
	this.get = {
		"success":true,
		"length": null,
		"data": []
	}
	
	//Error Response
	this.error = {
		"success":false,
		"message": "error",
		"errors": []
	}
}

//Parse request body to json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Request Error handling
app.use((err, req, res, next) => {
	if(err instanceof SyntaxError && err.status === 400 && 'body' in err){
        let result = new Result()
		
		result.error.message = 'Invalid JSON'
		result.error.errors.push(err.type)
		
		return res.status(err.status).json(result.error)
    }
	next()
})

/*
*
*Routes
*
*/

app.get('/getStudents', (req, res)=>{
	db.getDB().collection('students')
	.find({})
	.toArray((err, documents) => {
		if(err){
			let result = new Result()
			result.error.message = err
			return res.json(result.error)
		}else{
			let result = new Result()
			result.get.length = documents.length
			result.get.data = documents
			return res.json(result.get)
		}
	})
})

app.post('/addStudent', (req, res) => {
	let input = req.body
	let passed = false
	
	//Student Required Fields
	const fields = [ 'studentId', 'fname', 'lname', 'course', 'age' ]
	
	const validInput = utils.checkFields(fields, input)
	
	if(validInput.passed){
		db.getDB().collection('students')
		.insertOne(input, (err, opres)=>{
			if(err){
				let result = new Result()
				result.error.message = "error"
				result.error.errors.push(err.errmsg)
				
				return res.json(result.error)
			}else{
				let result = new Result()
				result.insert.message
				result.insert.data = input
				
				return res.json(result.insert)
			}
		})
	}else{
		let result = new Result()
		result.error.errors = validInput.errors
		
		return res.json(result.error)
	}
})

db.connect((err)=>{
	if(err){
		console.log('Unable to connect to the database')
		process.exit(1)
	}else{
		app.listen(port, ()=>{
			console.log("Server Running at port %s", port)
		})
	}
})

