const inquirer = require('inquirer');
const SQL_Manager = require('../../util/SQL_Manager.js');

module.exports = async function() {
    var prompt = (await inquirer).createPromptModule();
    let answers = await prompt([
        {
            name: 'first_name',
            message: 'What is the first name?',
            type: 'input'
        },
        {
            name: 'last_name',
            message: 'What is the last name?',
            type: 'input'
        },
        {
            name: 'role',
            message: 'What is their role?',
            type: 'input'
        },
        {
            name: 'manager_firstName',
            message: "What is their manager's first name?",
            type: 'input'
        },
        {
            name: 'manager_lastName',
            message: "What is their manager's last name?",
            type: 'input'
        }
    ]);
    let errors = [];

    // Find target role
    let targetRole = await SQL_Manager.getOne("roles",`title="${answers.role}"`).catch(err => console.log(err));
    if (!targetRole) {
        errors.push("Role not found!");
    } else { 
        answers.role_id = targetRole.id;
        delete answers.role;
    }

    // Find target manager
    if (answers.manager_firstName) {
        let targetManager = await SQL_Manager.getOne("employees",`first_name="${answers.manager_firstName}" AND last_name="${answers.manager_lastName}"`).catch(err => console.log(err));
        if (!targetManager) {
            errors.push("Manager not found!");
        } else { 
            answers.manager_id = targetManager.id;
            
        }
    }
    delete answers.manager_firstName;
    delete answers.manager_lastName;

    // Do DB operation
    if (errors.length == 0) {
        await SQL_Manager.do(`INSERT INTO employees ${SQL_Manager.objectToSqlInsertString(answers)}`).catch(err => errors.push(err));
    }

    if (errors.length > 0) {
        console.log("Operation failed due to the following error(s):")
        for (err of errors) {
            console.log("-",err);
        }
    } else {
        console.log("Added employee to the database!");
    }
    return answers;
}