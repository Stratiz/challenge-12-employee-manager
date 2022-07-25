const SQL_Manager = require('../../util/SQL_Manager.js');
const cTable = require('console.table');

module.exports = async function() {
    let data = await SQL_Manager.do("SELECT * FROM roles JOIN departments ON roles.department_id=departments.id").catch(err => console.log("Failed to get roles!", err));
    for (entry of data) {
        entry.department = entry.name;
        delete entry.department_id;
        delete entry.name;
    };
    console.table(data);
}