//Imports

const express = require('express');
const ratingService = require('../service/ratingService');


const { isAuthenticated} = require('../middlewares/auth');

// Defining Router
const router = express.Router();

//Add Rating 

router.post('/:meetupId/:reservationUser', async function (req, res) {

    const meetupDate = req.body.date;
    const meetupId = parseInt(req.params.meetupId);
    const reservationUser = parseInt(req.params.reservationUser);
    const valoration = parseInt(req.body.valoration);


    const responseDTO = await ratingService.addRatingAfterMeetups(meetupDate,meetupId,reservationUser,valoration);
    res.json(responseDTO);
})

// Average Rating 

router.get('/avg/:id', async function (req, res) {

    const id = parseInt(req.params.id);

    const responseDTO = await ratingService.avgMeetupRating(id)
    res.status(responseDTO.code).json(responseDTO);
})




module.exports = router;





