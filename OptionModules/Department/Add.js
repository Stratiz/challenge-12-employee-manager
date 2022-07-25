const inquirer = require('inquirer');
const SQL_Manager = require('../../util/SQL_Manager');

module.exports = async function() {
    var prompt = (await inquirer).createPromptModule();
    let answers = await prompt([
        {
            name: 'name',
            message: 'What is the name of the department?',
            type: 'input'
        }
    ]);
    let errors = [];
    
    SQL_Manager.do(`INSERT INTO departments (name) VALUES ("${answers.name}")`).catch(err => errors.push(err));

    if (errors.length > 0) {
        console.log("Operation failed due to the following error(s):")
        for (err of errors) {
            console.log("-",err);
        }
    } else {
        console.log("Added department to the database!");
    }
    return answers;
}