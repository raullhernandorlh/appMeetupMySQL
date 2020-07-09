const database = require('../database');
const express = require('express');
const reservationService = require('../service/reservationService');
const validation = require('../validations/validations')
const logger = require('../utilities/logger');

// Import Auth Middleware

const { isAuthenticated, isUserOfThisReservation, organizerUserReservations } = require('../middlewares/auth');


// Defining Router
const router = express.Router();



// Create Reservations

router.post('/:idUser/:idMeetup', isAuthenticated, async function (req, res) {

    const idUser = parseInt(req.params.idUser);
    const idMeetup = parseInt(req.params.idMeetup);

    console.log(idUser);
    console.log(idMeetup)

    if (idUser === undefined || idMeetup === undefined) {
        res.status(404).send();
    }

    // Adding the reservation

    let responseDTO;
    if (await reservationService.addReservation(idUser, idMeetup)) {
        responseDTO = {
            'code': 200,
            'description': 'Successfully created Reservation',
            'data': reservation
        };
    } else {
        responseDTO = {
            'code': 404,
            'description': 'The reservation could not be registered',
        };
    }

    return res.status(responseDTO.code).json(responseDTO);

})

// Delete Reservations

router.delete('/:id', isAuthenticated, isUserOfThisReservation,async function (req, res) {
    const id = parseInt(req.params.id);

    if (id === undefined) {
        res.status(402).send();
        return
    }

    reservationService.deleteReservation(id);
    res.send();

})



// User all reservations 

router.get('/userreservations/:id', isAuthenticated, organizerUserReservations, async function (req, res) {

    const id = parseInt(req.params.id);

    if (id === undefined) {
        res.status(402).send();
        return
    }

    const responseDTO = await reservationService.userReservations(id);
    return res.status(responseDTO.code).json(responseDTO);
})

// Organizer all reservations 

router.get('/organizerreservations/:id', isAuthenticated, organizerUserReservations , async function (req, res) {

    const id = parseInt(req.params.id);

    if (id === undefined) {
        res.status(402).send();
        return
    }

    const responseDTO = await reservationService.organizerReservations(id);
    return res.status(responseDTO.code).json(responseDTO);
})


// Reservation Detail

router.get('/reservation/:id', async function (req,res){

    const id = parseInt(req.params.id);

    const responseDTO = await reservationService.detailReservation(id);
    res.status(responseDTO.code).json(responseDTO);
})



module.exports = router;