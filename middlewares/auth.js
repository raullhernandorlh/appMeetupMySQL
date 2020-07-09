const database = require('../database');


require('dotenv').config();

const jwt = require('jsonwebtoken');
const {getMeetup} = require('../utilities/functionsForMiiddlewareAuthj');
const {getUserForUserProfile} = require('../utilities/functionsForMiiddlewareAuthj');
const {getUserForOrganizerProfile} = require('../utilities/functionsForMiiddlewareAuthj');
const {getUserForReservation} = require('../utilities/functionsForMiiddlewareAuthj');
const {getOrganizerUserReservations} = require('../utilities/functionsForMiiddlewareAuthj');


const { Console } = require('winston/lib/winston/transports');



//ALL REGISTER USER (NO ANONYMOUS USERS)
// Verify that to perform an action the user (user or organizer) must be logged in

const isAuthenticated = (req, res, next) => {
    const { authorization } = req.headers;

    try {
        const decodedToken = jwt.verify(authorization, process.env.SECRET);
        req.auth = decodedToken;
    } catch (e) {
        const authError = new Error('Error!!! The user is not authenticated');
        authError.status = 401;
        return next(authError);
    }
    next();
}

// ADMIN -- Authentication for administrative tasks of the database
const isAdmin = (req, res, next) => {

    if (!req.auth || req.auth.role !== 'admin') {
        const authError = new Error('Only the administrator user is enabled for this operation');
        authError.status = 403;
        return next(authError);
    }
    next();
}

//Organizer - You can act on the creation, modification and deletion of meetups and you can also reserve them

const isOrganizer = (req, res, next) => {


    if (!req.auth || req.auth.role !== 'organizer') {
        const authError = new Error('Only the organizer is enabled for this operation');
        authError.status = 403;
        return next(authError);
    }
    next();
}


// User - You can book meetups and manage your profile

const isUser = (req, res, next) => {
    if (!req.auth || req.auth.role !== 'user') {
        const authError = new Error('Only the user is enabled for this operation');
        authError.status = 403;
        return next(authError);
    }
    next();
}

//Verify that the organizer is the owner of a meetup to prevent other organizers 
//from removing, modifying, or listing the meetups from this


const isOrganizerOfThisMeetup = async (req, res, next) => {

    const id = req.params.id;
    const findIdOrganizer = await getMeetup(id);

        if (!req.auth || req.auth.id !== findIdOrganizer[0].id_user) {
            const authError = new Error(`Unauthorized This user cannot perform this action`);
            authError.status = 403;
            return next(authError);
        }

    next();
}

// Metodo para verificar si este perfil de organizador corresponde a este organizador

const isUserOfThisOrganizerProfile =  async(req, res, next) => {

    const id = parseInt(req.params.id);
    console.log('Este es el id del usuario')
    console.log(id);

    const findIdUser = await getUserForOrganizerProfile(id);
   

    if (!req.auth || req.auth.id !== findIdUser[0].id) {
        const authError = new Error(`Unauthorized This user cannot perform this action`);
        authError.status = 403;
        return next(authError);
    }

    next();
}


// Method to verify if this user profile corresponds to this user

const isUserOfThisUserProfile =  async(req, res, next) => {

    const id = parseInt(req.params.id);

    const findIdUser = await getUserForUserProfile(id);

    if (!req.auth || req.auth.id !== findIdUser[0].id) {
        const authError = new Error(`Unauthorized This user cannot perform this action`);
        authError.status = 403;
        return next(authError);
    }

    next();
}


// Method to verify if this reservation corresponds to this user (type user)

const isUserOfThisReservation = async (req, res, next) => {

    const id = parseInt(req.params.id);

    const findIdUser = await getUserForReservation(id);
    console.log(findIdUser);

    if (!req.auth || req.auth.id !== findIdUser[0].id) {
        const authError = new Error(`Unauthorized This user cannot perform this action`);
        authError.status = 403;
        return next(authError);
    }

    next();
}

// Method to verify if this reservation corresponds to this user (type organizer)
const organizerUserReservations = async (req, res,next) => {

    id = parseInt(req.params.id);
    const findIdUser = await getOrganizerUserReservations(id);

    if (!req.auth || req.auth.id !== findIdUser[0].id_user) {
        const authError = new Error('Only the user of reservations can view them');
        authError.status = 403;
        return next(authError);
    }
    next();

}

module.exports = {
    isAuthenticated,
    isOrganizer,
    isAdmin,
    isUser,
    isOrganizerOfThisMeetup,
    isUserOfThisOrganizerProfile,
    isUserOfThisUserProfile,
    isUserOfThisReservation,
    organizerUserReservations
}
