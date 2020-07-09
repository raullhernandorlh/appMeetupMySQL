
const database = require('../database');



async function getMeetup(id) {


    const findUser = "SELECT id_user FROM meetups M ,organizerprofiles OP ,users U WHERE M.id_organizer_profile = OP.id AND OP.id_user = U.id AND M.id = ? "
    const connection = await database.connection();
    const [rows] = await connection.execute(findUser,[id]);
    return rows;
}

async function getUserForOrganizerProfile(id) {

    const findOrganizerProfile = 'SELECT U.id FROM users U, organizerprofiles OP where OP.id_user = U.id AND OP.id = ?'
    const connection = await database.connection();
    const [rows] = await connection.execute(findOrganizerProfile,[id]);
    return rows;
}


async function getUserForUserProfile(id) {

    const findUserProfile = 'SELECT U.id FROM users U, usersprofiles UP where UP.id_user = U.id AND UP.id = ?'
    const connection = await database.connection();
    const [rows] = await connection.execute(findUserProfile,[id]);
    return rows;
}


async function getUserForReservation(id) {

    const findReservationUser = 'SELECT  U.id , U.user_type FROM reservations R ,users U WHERE R.id_user = U.id AND R.id = ?'
    const connection = await database.connection();
    const [rows] = await connection.execute(findReservationUser,[id]);
    return rows;
}


async function getOrganizerUserReservations(id){
    const findReservationUser = 'SELECT R.id_user from reservations R , users U WHERE R.id_user = U.id AND U.id = ?'
    const connection = await database.connection();
    const [rows] = await connection.execute(findReservationUser,[id]);
    return rows;
}




module.exports = {
    getMeetup,
    getUserForOrganizerProfile,
    getUserForUserProfile,
    getUserForReservation,
    getOrganizerUserReservations
}