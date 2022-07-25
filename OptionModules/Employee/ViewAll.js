
const SQL_Manager = require('../../util/SQL_Manager.js');
const cTable = require('console.table');

module.exports = async function() {
    let data = await SQL_Manager.do("SELECT * FROM employees JOIN roles ON employees.role_id=roles.id JOIN departments ON roles.department_id=departments.id").catch(err => console.log("Failed to get roles!", err));
    for (entry of data) {
        if (entry.manager_id) {
            let targetManager = await SQL_Manager.do(`SELECT * FROM employees WHERE id=${entry.manager_id} LIMIT 1`).catch(err => console.log("Failed to get manager!", err));
            if (targetManager[0]) {
                entry.manager = targetManager[0].first_name && `${targetManager[0].first_name} ${targetManager[0].last_name}` || "NONE";
            }
        }
        

        entry.department = entry.name;
        entry.role = entry.title;
        

        delete entry.department_id;
        delete entry.name;
        delete entry.role_id;
        delete entry.manager_id;
    };
    console.table(data);
}