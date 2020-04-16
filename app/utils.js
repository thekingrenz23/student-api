function checkFields(rfields, input){
	let result = {
		passed: true,
		errors: []
	}
	
	rfields.forEach((data, index) => {
		if(!(data in input)){
			result.errors.push(`'${data}' - field is required`)
			result.passed = false
		}else if(input[data] == null && input[data] == undefined){
			result.errors.push(`'${data}' - field cannot be null or undefined`)
			result.passed = false
		}else if(input[data].length == 0){
			result.errors.push(`'${data}' - field value is not valid`)
			result.passed = false
		}
	})
	
	return result
}

module.exports = { checkFields }