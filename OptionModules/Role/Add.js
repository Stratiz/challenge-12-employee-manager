const inquirer = require('inquirer');
const SQL_Manager = require('../../util/SQL_Manager');

module.exports = async function() {
    let departments = await SQL_Manager.do("SELECT * FROM departments").catch(err => console.log("Failed to get Departments!", err));
    if (departments && departments.length > 0) {
        let departmentNames = [];
        for (department of departments) {
            departmentNames.push(department.name);
        }
        var prompt = (await inquirer).createPromptModule();
        let answers = await prompt([
            {
                name: 'title',
                message: 'What is the name of the role?',
                type: 'input'
            },
            {
                name: 'salary',
                message: 'What is the salary of the role?',
                type: 'input'
            },
            {
                name: 'department',
                message: 'What is the department of the role?',
                type: 'list',
                choices: departmentNames
            },
        ]);
        
        let errors = [];

        // Check if salary is number
        if (!Number(answers.salary) > 0) {
            errors.push("Salary must be a number >= 0!");
        }

        // Find target department
        let targetDepartment = await SQL_Manager.getOne("departments",`name="${answers.department}"`).catch(err => console.log(err));
        if (!targetDepartment) {
            errors.push("Department not found!");
        } else { 
            answers.department_id = targetDepartment.id;
            delete answers.department;
        }

        // Do DB operation
        if (errors.length == 0) {
            await SQL_Manager.do(`INSERT INTO roles ${SQL_Manager.objectToSqlInsertString(answers)}`).catch(err => errors.push(err));
        }

        if (errors.length > 0) {
            console.log("Operation failed due to the following error(s):")
            for (err of errors) {
                console.log("-",err);
            }
            console.log("\n") //PADDING
        } else {
            console.log("Added role to the database!");
        }
        return answers;
    }
}