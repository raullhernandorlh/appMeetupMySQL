const database = require('../database');
const { connection } = require('../database');
const logger = require('../utilities/logger');
const { getMaxListeners } = require('../utilities/logger');
let jwt = require('jsonwebtoken');
const { Connection } = require('mysql2');


/**
 * Función para comprobar si un usuario existe ya en la base de datos
 * @param email
 */

async function userExist(email) {
    const sql = 'SELECT id FROM users WHERE email = ?';
    const connection = await database.connection();
    const [rows] = await connection.execute(sql, [email]);
    return rows.length === 1;
}

async function getUser(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const connection = await database.connection();
    const [rows] = await connection.execute(sql, [email]);
    return rows.length === 1;
}


async function registerUser(register) {
    const userEmail = register.email;

    //Creating Users
    const sql = 'INSERT INTO users (first_name,last_name,user_image,email,phone,user_type,user_autonomous_community,user_province,user_city,organizer_name,organizer_autonomous_community,organizer_province,organizer_city,description_text,pass) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, SHA2(?, 512))'
    const connection = await database.connection();
    await connection.execute(sql, Object.values(register));


    // Creating Profiles for User (Organizer)

    const userId = 'SELECT id,user_type from users where email = ?';
    const rows = await connection.execute(userId, [userEmail]);
    rows[0].forEach(row => {
        if (row.user_type === 'organizer') {
            const sqlInsertOrganizerUserProfile = "INSERT INTO usersprofiles (first_name, last_name, user_image, user_autonomous_community, user_province, user_city, phone, id_user) VALUES ( ? , ? , ? , ? , ? , ? , ?, ? )";
            connection.query(sqlInsertOrganizerUserProfile, [register.firstName, register.lastName, register.userImage, register.userAutonomousCommunity
                , register.userProvince, register.userCity, register.phone, row.id], function (error) {
                    if (error) {
                        const errorResponse = '{"error", "An error occurred while inserting the profile"}';
                        return errorResponse;
                    }
                })
            logger.info(`The user profile ${register.email} has been created`);

            const sqlInsertOrganizerOrganizerProfile = 'INSERT INTO organizerprofiles (organizer_name, organizer_autonomous_community, organizer_province, organizer_city, description,id_user)VALUES( ?, ?, ?, ?, ?, ?)'
            connection.query(sqlInsertOrganizerOrganizerProfile, [register.organizerName, register.organizerAutonomousCommunity,
            register.organizerProvince, register.organizerCity, register.description, row.id], function (error) {
                if (error) {
                    const errorResponse = '{"error", "An error occurred while inserting the Organizer Profile"}';
                    return errorResponse;
                }
                return [register.user, register.email];
            })

            logger.info(`The organizer profile ${register.email} has been created`);
        }

        // Creating Profiles for User (User)

        if (row.user_type === 'user') {
            const sqlInsertUserProfile = "INSERT INTO usersprofiles (first_name, last_name, user_image, user_autonomous_community, user_province, user_city, phone, id_user) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? )";
            connection.query(sqlInsertUserProfile, [register.firstName, register.lastName, register.userImage, register.userAutonomousCommunity
                , register.userProvince, register.userCity, register.phone, row.id], function (error) {
                    if (error) {
                        const errorResponse = '{"error", "An error occurred while inserting the profile"}';
                        return errorResponse;
                    }
                })
            logger.info(`The user profile ${register.email} has been created`);

        }

    })

}


// USER LOGIN

async function loginUser(email, pass) {
    const sql = 'SELECT id FROM usuarios WHERE email = ? AND pass = SHA2(?, 512)';

    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sql, [email, pass]);

        let description;
        if (!rows[0]) {
            description = 'User/Password incorrect';
        } else {
            description = 'login successfully';
        }

        let responseDTO = {
            'code': 200,
            'description': description,
        };

        if (rows[0]) {
            responseDTO['id'] = rows[0].id;
        }

        return responseDTO;
    } catch (exception) {
        return {
            'code': 500,
            'description': exception.toString()
        };
    }
}


async function deleteUser(id, usertype) {

    if (usertype === 'user') {

        const sqlDeleteUser = "DELETE FROM users WHERE id = ? AND user_type = 'user'";
        const connection = await database.connection();

        await connection.query(sqlDeleteUser, [id], function (error) {

            if (error) {
                const errorResponse = '{"error":"Se ha producido un error al eliminar al usuario"}';
                logger.error(`User ${id} has not been deleted`);
                return errorResponse
            }
        })


        const sqlDeleteUserUserProfile = 'DELETE FROM usersprofiles WHERE id = ? ';
        connection.query(sqlDeleteUserUserProfile, [id], function (error) {

            if (error) {
                const errorResponse = '{"error":"Se ha producido un error al eliminar al perfil del usuario"}';
                logger.error(`User Profile for user ${id} has not been deleted`);
                return errorResponse
            }
        })
    }

    if (usertype === 'organizer') {

        const sqlDeleteUserOrganizer = "DELETE FROM users WHERE id = ? AND user_type = 'organizer'";
        const connection = await database.connection();
        await connection.query(sqlDeleteUserOrganizer, [id], function (error) {

            if (error) {
                const errorResponse = '{"error":"Se ha producido un error al eliminar al usuario organizer"}';
                logger.error(`User ${id} has not been deleted`);
                return errorResponse
            }
            return [id];
        })
        // Delete Organizer (User Profile)
        const sqlDeleteOrganizerUserProfile = 'DELETE FROM usersprofiles WHERE id = ? ';
        await connection.query(sqlDeleteOrganizerUserProfile, [id], function (error) {

            if (error) {
                const errorResponse = '{"error":"Se ha producido un error al eliminar el perfil de usuario del Organizador"}';
                logger.error(`User Profile for user ${id} has not been deleted`);
                return errorResponse
            }
            return [id];
        })
        const sqlDeleteOrganizerOrganizerProfile = 'DELETE FROM organizerprofiles WHERE id = ? ';
        await connection.query(sqlDeleteOrganizerOrganizerProfile, [id], function (error) {

            if (error) {
                const errorResponse = '{"error":"Se ha producido un error al eliminar el perfil de organizador del Organizador"}';
                logger.info(`Organizer Profile for user ${register.email} has been deleted`);
                return errorResponse
            }
            return [id];
        })

    }

}

async function listUsers() {

    const sql = 'SELECT first_name, last_name, email FROM users';
    const connection = await database.connection();
    const [rows] = await connection.execute(sql);

    return rows;
}

async function userList(id) {

    const sql = 'SELECT * FROM users WHERE id = ?';

    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sql, [id]);
        let description;
        if (!rows[0]) {
            description = `The user ${id} does not exist in the database`;
        } else {
            description = `User displayed correctly ${id}`;
        }

        let responseDTO = {
            'code': 200,
            'description': description,
            'data': rows[0]
        };

        return responseDTO;

    } catch (exception) {
        return {
            'code': 500,
            'description': exception.toString()
        };
    }
}

module.exports = {
    userExist,
    registerUser,
    loginUser,
    deleteUser,
    listUsers,
    userList
};