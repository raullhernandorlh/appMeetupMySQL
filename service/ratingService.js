//Imports

const database = require('../database');
const { connection } = require('../database');
const logger = require('../utilities/logger');
const { getMaxListeners } = require('../utilities/logger');


//See rating assigned to the Meetup by previous meetups

async function avgMeetupRating(id) {

    const sql = 'SELECT AVG(valoration) AS media FROM ratings WHERE id_meetup = ? AND valoration != 0 ';

    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sql, [id]);
        let description;
        if (!rows[0]) {
            description = `The average of the meetup ${id} ratings could not be performed`;
        } else {
            description = `The average of the meetup ${id} ratings was successful`;
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

// Add ratings after meetups

async function addRatingAfterMeetups(meetupDate,meetupId,reservationUser,valoration) {

    const selectIdMeetup = 'SELECT R.id_meetup FROM meetups M , reservations R,  users U WHERE M.id = R.id_meetup AND R.id_user = U.id AND M.date = ? < CURDATE() AND M.id = ? AND R.id_user = ?'
    const connection = await database.connection();
    const rows = await connection.execute(selectIdMeetup, [meetupDate, meetupId, reservationUser]);
    rows[0].forEach(row => {
        try {
            const sqlAddRating = 'INSERT INTO ratings (valoration,id_meetup) VALUES (?,?)';
            connection.query(sqlAddRating, [valoration,row.id_meetup], function (error) {
                let description;
                if (!rows[0]) {
                    description = `Could not insert rating for this meetup ${idMeetup}`;
                } else {
                    description = `The rating for meetup ${id} was successful`;
                }

                let responseDTO = {
                    'code': 200,
                    'description': description,
                    'data': rows[0]
                };

                return responseDTO;
            })

            if (error) {
                const errorResponse = '{"error", "The date is before the meetup. You cannot vote yet"}';
                return errorResponse;
            }
        } catch (exception) {
            return {
                'code': 500,
                'description': exception.toString()
            };
        }

      
    })
    logger.info(`The valuation of the meetup has been carried out on the following date ${meetupDate}`);

}

module.exports = {
    avgMeetupRating,
    addRatingAfterMeetups
}