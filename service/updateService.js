//Imports

const database = require('../database');
const { connection } = require('../database');
const logger = require('../utilities/logger');
const { getMaxListeners } = require('../utilities/logger');


async function addUpdate(update) {

    const sqlUpdate = update.update;
    const idMeetup = update.idMeetup

    try {
        const sqlAddUpdate = "INSERT INTO updates (update_text,id_meetup) VALUES (?,?)";
        const connection = await database.connection();
        await connection.query(sqlAddUpdate, [sqlUpdate,idMeetup], function (error) {
            if (error) {
                const errorResponse = '{"error", "An error occurred while adding update"}';
                return errorResponse;
            }
        })
        logger.info(`The Update has been created`);

        return true;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = {
    addUpdate
}