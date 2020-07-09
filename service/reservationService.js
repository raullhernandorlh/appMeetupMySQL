//Imports

const database = require('../database');
const { connection } = require('../database');
const logger = require('../utilities/logger');
const { getMaxListeners } = require('../utilities/logger');


async function addReservation(idUser, idMeetup) {

    const sqlSearchMeetup = 'SELECT meetup_price FROM meetups WHERE id = ? ';
    const connection = await database.connection();
    const rows = await connection.execute(sqlSearchMeetup, [idMeetup]);
    rows[0].forEach(row => {
        const sqlAddReservation = 'INSERT INTO reservations (id_user,id_meetup,reservation_price,paid_out) VALUES ( ?, ?, ?, ?)';
        connection.query(sqlAddReservation, [idUser, idMeetup, row.meetup_price, false], function (error) {
            if (error) {
                const errorResponse = '{"error", "An error occurred while adding the Rervation"}';
                return errorResponse;
            }
        })
        logger.info(`The Reservation added successfully`);
    })

}

async function deleteReservation(id) {

    const sqlDeleteReservation = "DELETE FROM reservations WHERE id = ? ";
    const connection = await database.connection();

    await connection.query(sqlDeleteReservation, [id], function (error) {

        if (error) {
            const errorResponse = `An error occurred while deleting the reservation ${id}`;
            logger.error(`Reservation ${id} has not been deleted`);
            return errorResponse
        }
        return [id];
    })

}

async function detailReservation(id) {

    const sqlReservationDetail = 'SELECT * FROM reservations WHERE id = ?';

    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlReservationDetail, [id]);
        let description;
        if (!rows[0]) {
            description = `The reservation ${id} does not exist in the database`;
        } else {
            description = `Reservation displayed correctly ${id}`;
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

// Uaser All Reservations
async function userReservations(id) {
    const sqlUserReservations = "SELECT U.first_name, U.email, U.phone, R.reservation_date,R.reservation_price, R.paid_out  FROM users U, reservations R WHERE R.id_user = U.id AND U.id = ? AND U.user_type = 'user'"

    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlUserReservations, [id]);
        console.log(rows[0]);
        let description;
        if (!rows[0]) {
            description = `There are no reservations in the database associated with this user ${id}`;
        } else {
            description = `User reservations have been displayed correctly ${id}`;
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

// Organizer All Reservations

async function organizerReservations(id) {
    console.log(id);
    const sqlOrganizerReservations = "SELECT U.first_name, U.email, U.phone, R.reservation_date,R.reservation_price, R.paid_out  FROM users U, reservations R WHERE R.id_user = U.id AND U.id = ? AND U.user_type = 'organizer'"
    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlOrganizerReservations, [id]);
        console.log(rows);
        
        let description;
        if (!rows[0]) {
            description = `There are no reservations in the database associated with this user ${id}`;
        } else {
            description = `User reservations have been displayed correctly ${id}`;
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
    addReservation,
    deleteReservation,
    userReservations,
    organizerReservations,
    detailReservation
}