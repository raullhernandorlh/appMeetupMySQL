//Imports

const database = require('../database');
const { connection } = require('../database');
const logger = require('../utilities/logger');
const { getMaxListeners } = require('../utilities/logger');

//TODO Arreglar para poder añadir comentarios. TIMESTAMP CURRENT generado directamente en base de datos

async function addComment(comment) {

    const sqlComment = comment.update;
    const idMeetup = comment.idMeetup

    try {
        const sqlAddComment = "INSERT INTO comments (comment_text,id_meetup) VALUES (?,?)";
        const connection = await database.connection();
        await connection.query(sqlAddComment, [sqlComment,idMeetup], function (error) {
            if (error) {
                const errorResponse = '{"error", "An error occurred while adding comment"}';
                return errorResponse;
            }
        })
        logger.info(`The Comment has been created`);

        return true;
    }
    catch (e) {
        console.log(e);
    }
}


module.exports = {
    addComment
}