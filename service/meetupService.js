//Imports

const database = require('../database');
const { connection } = require('../database');
const logger = require('../utilities/logger');
const { getMaxListeners } = require('../utilities/logger');
const { Console } = require('winston/lib/winston/transports');
const moment = require('moment');
moment.locale('es');



// Register Meetups

async function registerMeetup(meetup, id) {

    const selectOrganizerProfileId = 'SELECT id from organizerprofiles  WHERE id = ?'
    const connection = await database.connection();
    const rows = await connection.execute(selectOrganizerProfileId, [id]);
    rows[0].forEach(row => {
        const sqlInsertMeetup = 'INSERT INTO meetups (title,date,time,duration,location,category,meetup_principal_image,meetup_second_image,meetup_third_image,meetup_price,description,id_organizer_profile) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        connection.query(sqlInsertMeetup, [meetup.title, meetup.date,meetup.time, meetup.duration,meetup.location, meetup.category, meetup.meetupPrincipalImage
            , meetup.meetupSecondImage, meetup.meetupThirdImage, meetup.meetupPrice, meetup.description, row.id], function (error) {
                if (error) {
                    const errorResponse = '{"error", "An error occurred inserting the meetup"}';
                    return errorResponse;
                }
            })
        logger.info(`The meetup ${meetup.title} has been created`);

    })

}


// Delete Meetup

async function deleteMeetup(id) {

    const sqlDeleteMeetup = "DELETE FROM meetups WHERE id = ? ";
    const connection = await database.connection();

    await connection.query(sqlDeleteMeetup, [id], function (error) {

        if (error) {
            const errorResponse = '{"error":"Se ha producido un error al eliminar el meetup"}';
            logger.error(`Meetup ${id} has not been deleted`);
            return errorResponse
        }
        return [id];
    })

}

// List Organizer Meetups
async function listOrganizerMeetups(id) {

    const sql = 'SELECT title, date, time , localtion, duration, meetup_city, category, meetup_price, description FROM meetups WHERE id_organizer_profile = ?';
    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sql, [id]);
        let description;
        if (!rows[0]) {
            description = `The Organizer with this id  ${id} does not exist in the database`;
        } else {
            description = `Organizer Meetups displayed correctly ${id}`;
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

// Filter meetups

async function filterMeetups(filter) {

    const category = filter.category;
    const price = parseInt(filter.price);
    const duration = parseInt(filter.duration);
    const city = filter.city;
    const date = filter.date;
    const time = filter.time;

    // Filter by Duration And Category

    if ((duration) && (category)) {
        const sqlFilterByDurationAndCategory = 'SELECT * FROM meetups WHERE meetup_price = ? AND category = ? ORDER BY category '
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlFilterByDurationAndCategory, [price,category]);
        return rows;
    }

    // Filter by Duration And Price

    if ((duration) && (price)) {

        const sqlFilterByDurationAndPrice ='SELECT * FROM meetups WHERE meetup_price = ? AND duration = ? ORDER BY meetup_price';
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlFilterByDurationAndPrice, [price,duration]);
        return rows;
    }
    
    // Filter By Category

    if (category) {
        const sqlFilterCategory = 'SELECT * FROM meetups WHERE category = ?';
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlFilterCategory, [category]);
        return rows;
    }

    // Filter By Date

    if (date) {
        const sqlFilterPrice = 'SELECT * FROM meetups WHERE date = ?'; 
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlFilterPrice, [date]);
        return rows;
    }

    // Filter by City

    if (city) {
        const sqlFilterPrice = 'SELECT * FROM meetups WHERE meetup_city = ?'; 
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlFilterPrice, [city]);
        return rows;
    }


    // Filter By Time

    if (time) {
        const sqlFilterPrice = 'SELECT * FROM meetups WHERE time = ? ORDER BY time ';
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlFilterPrice, [time]);
        return rows;
    }


    // Filter By Price
    if (price) {
        const sqlFilterPrice = 'SELECT * FROM meetups WHERE meetup_price = ? ORDER BY meetup_price ';
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlFilterPrice, [price]);
        return rows;
    }

    // Filter By Duration
    if (duration) {
        const sqlFilterDuration  = 'SELECT * FROM meetups WHERE duration = ? ORDER BY meetup_price ';
        const connection = await database.connection();
        const [rows] = await connection.execute(sqlFilterDuration,[duration]);
        return rows;
    }

}

// Meetup Detail
async function detailMeetup(id) {

    const sql = 'SELECT * FROM meetups WHERE id = ?';

    try {
        const connection = await database.connection();
        const [rows] = await connection.execute(sql, [id]);
        let description;
        if (!rows[0]) {
            description = `The meetup ${id} does not exist in the database`;
        } else {
            description = `Meetup displayed correctly ${id}`;
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

// Update Meetup


async function updateMeetup(meetup, id) {

    const meetupDuration = parseInt(meetup.duration);
    const meetupPrice = parseInt(meetup.meetupPrice);

    const selectMeetupId = 'SELECT id from meetups WHERE id = ?'
    const connection = await database.connection();
    const rows = await connection.execute(selectMeetupId, [id]);
    rows[0].forEach(row => {

        const sqlUpdateMeetup = 'UPDATE meetups SET date = ?, time = ? , duration = ?, meetup_principal_image = ?, meetup_second_image = ?, meetup_third_image = ?, meetup_price = ?, description = ? WHERE id = ?';
        connection.query(sqlUpdateMeetup, [meetup.date, meetup.time, meetupDuration, meetup.meetupPrincipalImage, meetup.meetupSecondImage, meetup.meetupThirdImage, meetupPrice, meetup.description, row.id], function (error) {
            if (error) {
                const errorResponse = '{"error", "An error occurred while updating ${} the meetup"}';
                return errorResponse;
            }
        })
        logger.info(`The update of the meetup with id ${id} was successful`);
    })


}

module.exports = {
    registerMeetup,
    deleteMeetup,
    listOrganizerMeetups,
    filterMeetups,
    detailMeetup,
    updateMeetup
}