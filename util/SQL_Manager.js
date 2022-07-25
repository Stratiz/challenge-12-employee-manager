const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'employees_db'
});

module.exports = { // Yes making my own promise wrapper
    outputTable: function(tableName) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT * FROM ${tableName}`,
                function(err, results, fields) {
                    if (err) {
                        reject(err)
                    } else {
                        if (results.length > 0) {
                            console.table(results); // results contains rows returned by server
                        } else {
                            console.log("No results found!");
                        }
                        resolve(results)
                        
                    }
                    //console.log(fields); // fields contains extra meta data about results, if available
                }
            );
        });
    },
    getOne : function(tableName, queryString) {
        return new Promise((resolve, reject) => {
            connection.query(
                `SELECT * FROM ${tableName} WHERE ${queryString} LIMIT 1`,
                function(err, results, fields) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(results[0])
                    }
                    //console.log(fields); // fields contains extra meta data about results, if available
                }
            );
        });
    },
    do : function(queryString) {
        return new Promise((resolve, reject) => {
            connection.query(
                queryString,
                function(err, results, fields) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(results)
                    }
                }
            );
        });
    },
    objectToSqlInsertString : function(obj) {
        let keyString = "";
        for (let key of Object.keys(obj)) {
            keyString += (keyString.length > 0 && ", " || "") + `${key}`;
        }

        let valueString = "";
        for (let value of Object.values(obj)) {
            valueString += (valueString.length > 0 && ", " || "") + `"${value}"`;
        }
        return "(" + keyString + ") VALUES (" + valueString + ")";
    }
}