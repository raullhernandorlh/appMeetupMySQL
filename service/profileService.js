//Imports

const database = require('../database');
const { connection } = require('../database');
const logger = require('../utilities/logger');
const { getMaxListeners } = require('../utilities/logger');

async function updateOrganizerProfile(id, organizerProfile) {


    const selectOrganizerProfileIdToUpdate = 'SELECT id from organizerprofiles WHERE id = ?'
    const connection = await database.connection();
    const rows = await connection.execute(selectOrganizerProfileIdToUpdate, [id]);
    rows[0].forEach(row => {
        const sqlUpdateOrganizerProfile = 'UPDATE organizerprofiles SET organizer_name = ?, organizer_autonomous_community = ?, organizer_province = ?, organizer_city = ?, description = ?  WHERE id = ?';
        connection.query(sqlUpdateOrganizerProfile, [organizerProfile.organizerName, organizerProfile.organizerAutonomousCommunity,
        organizerProfile.organizerProvince, organizerProfile.organizerCity, organizerProfile.description, row.id], function (error) {
            if (error) {
                const errorResponse = '{"error", "An error occurred while updating ${} the meetup"}';
                return errorResponse;
            }
        })
        logger.info(`The update of the organizer profile with id ${id} was successful`);
    })
}


async function updateUserProfile(id, userProfile) {

    const selectUsersProfileIdToUpdate = 'SELECT id FROM usersprofiles WHERE id = ?'
    const connection = await database.connection();
    const rows = await connection.execute(selectUsersProfileIdToUpdate, [id]);
    rows[0].forEach(row => {
        const sqlUpdateUsersProfile = 'UPDATE usersprofiles SET first_name = ?, last_name = ?, user_image = ?, user_autonomous_community = ?, user_province = ? ,user_city = ? , phone = ? WHERE id = ?';
        connection.query(sqlUpdateUsersProfile, [userProfile.firstName, userProfile.lastName, userProfile.userImage,
        userProfile.userAutonomousCommunity, userProfile.userProvince, userProfile.userCity,
        userProfile.phone, row.id], function (error) {
            if (error) {
                const errorResponse = '{"error", "An error occurred while updating ${} the meetup"}';
                return errorResponse;
            }
        })
        logger.info(`The update of the user profile with id ${id} was successful`);
    })
}


async function organizerProfileDetail(id) {

    const sql = 'SELECT OP.* FROM users U, organizerprofiles OP where OP.id_user = U.id AND OP.id = ?';

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

async function userProfileDetail(id) {

    const sql = 'SELECT UP.* FROM users U, usersprofiles UP where UP.id_user = U.id AND UP.id = ?';

    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sql, [id]);
        let description;
        if (!rows[0]) {
            description = `The user profile ${id} does not exist in the database`;
        } else {
            description = `User Profile displayed correctly ${id}`;
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

    updateOrganizerProfile,
    organizerProfileDetail,
    userProfileDetail,
    updateUserProfile
}