const inquirer = require('inquirer');
const SQL_Manager = require('../../util/SQL_Manager');

module.exports = async function() {
    let employees = await SQL_Manager.do("SELECT * FROM employees").catch(err => console.log("Failed to get employees!", err));
    let roles = await SQL_Manager.do("SELECT * FROM roles").catch(err => console.log("Failed to get roles!", err));
    if (employees && employees.length > 0 && roles && roles.length > 0) {
        let employeeNames = [];
        for (employee of employees) {
            employeeNames.push(employee.first_name + " " + employee.last_name);
        }

        let roleNames = [];
        for (role of roles) {
            roleNames.push(role.title);
        }

        var prompt = (await inquirer).createPromptModule();
        let answers = await prompt([
            {
                name: 'employee',
                message: 'Whose role would you like to update?',
                type: 'list',
                options: employeeNames
            }
        ]);
        
        let selectedIndex = employeeNames.indexOf(answers.employee);
        if (selectedIndex >= 0 && employeeNames[selectedIndex]) {
            console.log("\n"); // Padding
            var prompt = (await inquirer).createPromptModule();
            let answers = await prompt([
                {
                    name: 'roleName',
                    message: 'Whose role would you like to update?',
                    type: 'list',
                    options: employeeNames
                }
            ]);

            let roleIndex = roleNames.indexOf(answers.roleName);
            if (roleIndex) {
                await SQL_Manager.do(`UPDATE employees SET role_id=${roleIndex} WHERE id=${employees[selectedIndex].id}`).catch(err => console.log("Failed to update role!", err));
                console.log("Updated role!")
            }

        } else if (answers.next == "Cancel") {
            console.log("Cancelled operation!")
        }
    } else {
        console.log("No employees found!");
    }
}