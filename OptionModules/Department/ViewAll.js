const SQL_Manager = require('../../util/SQL_Manager.js');

module.exports = async function() {
    await SQL_Manager.outputTable("departments").catch(err => console.log("Failed to output table!", err));
}