const inquirer = require('inquirer');
require('dotenv').config()

const options = [
    {
        Title : "View All Employees",
        Executor : require("./OptionModules/Employee/ViewAll.js")
    },
    {
        Title : "Add Employee",
        Executor : require("./OptionModules/Employee/Add.js")
    },
    {
        Title : "Update Employee Role",
        Executor : require("./OptionModules/Employee/UpdateRole.js")
    },
    {
        Title : "View All Roles",
        Executor : require("./OptionModules/Role/ViewAll.js")
    },
    {
        Title : "Add Role",
        Executor : require("./OptionModules/Role/Add.js")
    },
    {
        Title : "View All Departments",
        Executor : require("./OptionModules/Department/ViewAll.js")
    },
    {
        Title : "Add Department",
        Executor : require("./OptionModules/Department/Add.js")
    }
];

async function DoPrompt() {
    let choices = [];
    for (choice of options) {
        choices.push(choice.Title);
    }

    var prompt = (await inquirer).createPromptModule();
    let answers = await prompt([
        {
            name: 'next',
            message: 'What would you like to do?',
            type: 'list',
            choices: choices.concat(['Quit'])
        },
    ])
    
    let selectedIndex = choices.indexOf(answers.next);
    if (selectedIndex >= 0 && options[selectedIndex]) {
        console.log("\n"); // Padding
        await options[selectedIndex].Executor(); // Primary executor
        //console.log("\n"); // Padding
        DoPrompt();
    } else if (answers.next == "Quit") {
        console.log("Done!")
    }
}

DoPrompt();