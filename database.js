const mysql = require('mysql2/promise');

async function connection() {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'admin',
        password: 'admin',
        database: 'appmeetup'
    });
}

module.exports = {
    connection
};