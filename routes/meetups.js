//Imports
const database = require('../database');
const express = require('express');
const meetupService = require('../service/meetupService');
const validation = require('../validations/validations')
const logger = require('../utilities/logger');
const moment = require("moment");
moment.locale('es')


const { isAuthenticated, isOrganizer, isOrganizerOfThisMeetup } = require('../middlewares/auth');
// Defining Router
const router = express.Router();

// Array with all the categories 

const categories = ["natureandadventure", "sociallife", "languages", "beliefs"
    , "sportsAndPhisycalCondition", "careersandbusiness", "travels"]


// Create Meetups

router.post('/:id', isAuthenticated, isOrganizer, async function (req, res) {

    const id = parseInt(req.params.id);

    const meetup = {
        'title': req.body.title,
        'date':req.body.date,
        'time':req.body.time,
        'duration': req.body.duration,
        'location': req.body.location,
        'category': req.body.category,
        'meetupPrincipalImage': req.body.meetupPrincipalImage,
        'meetupSecondImage': req.body.meetupSecondImage,
        'meetupThirdImage': req.body.meetupThirdImage,
        'meetupPrice': req.body.meetupPrice,
        'description':req.body.description,
    };
  

    // Meetup Validation

    try {
        validation.meetupValidation(meetup,id)
        logger.info("The validation of register fields was successful");

    } catch (e) {
        res.status(400).send();
        return
    }


    // Categories Allowed

    if (meetup.category === categories[0] || meetup.category === categories[1] || meetup.category === categories[2]
        || meetup.category === categories[3] || meetup.category === categories[4] || meetup.category === categories[5]
        || meetup.category === categories[6]) {


        // Adding the meetup
        let responseDTO;
        if (await meetupService.registerMeetup(meetup,id)){
            responseDTO = {
                'code': 200,
                'description': 'Successfully created Meetup',
                'data': meetup
            };
        } else {
            responseDTO = {
                'code': 404,
                'description': 'The meetup could not be registered',
            };
        }
    
        return res.status(responseDTO.code).json(responseDTO);
    } else {
       
        res.status(404).send();
    }

})

// Delete Meetup

router.delete('/:id', isAuthenticated, isOrganizer, isOrganizerOfThisMeetup,async function (req, res){

    const id = parseInt(req.params.id);

    if (id === undefined) {
        res.status(402).send();
        return
    }

    meetupService.deleteMeetup(id);
    res.send();

})


// List Organizer Meetups

router.get('/listmeetups/:id', isAuthenticated,isOrganizer,isOrganizerOfThisMeetup, async function (req,res){

    const id = req.params.id;

    const responseDTO = await meetupService.listOrganizerMeetups(id);
    res.status(responseDTO.code).json(responseDTO);
})


// Filter Meetups 

router.get('/filter', async function (req,res){

    const { price, category, duration, city ,date, time } = req.query;

    let filter = {
        "price": price,
        "category": category,
        "duration": duration,
        "city": city,
        "date": date,
        "time":time
    }

    const filterMeetups = await meetupService.filterMeetups(filter);
    const responseDTO = {
        'code': 200,
        'data': filterMeetups
    };

    return res.status(responseDTO.code).json(filterMeetups);
})

// Detail Meetup

router.get('/meetup/:id', isAuthenticated, isOrganizer, isOrganizerOfThisMeetup,async function (req,res){

    const id = parseInt(req.params.id);

    const responseDTO = await meetupService.detailMeetup(id);
    res.status(responseDTO.code).json(responseDTO);
})


// Update Meetup 

router.put('/update/:id', isAuthenticated, isOrganizer, isOrganizerOfThisMeetup, async function (req,res) {

    let  id  = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).send();
        return;
    }

    const meetup = {
        'date':req.body.date,
        'time':req.body.time,
        'duration': req.body.duration,
        'meetupPrincipalImage': req.body.meetupPrincipalImage,
        'meetupSecondImage': req.body.meetupSecondImage,
        'meetupThirdImage': req.body.meetupThirdImage,
        'meetupPrice': req.body.meetupPrice,
        'description':req.body.description,
    };

    // Meetup Validation

    try {
        validation.meetupUpdateValidation(meetup);

    } catch (e) {
        res.status(400).send();
        return
    }

    // Updating the meetup
    
        let responseDTO;
        if (await meetupService.updateMeetup(meetup,id)){
            responseDTO = {
                'code': 200,
                'description': `Meetup ${id} successfully updated`,
                'data': meetup
            };
        } else {
            responseDTO = {
                'code': 404,
                'description': `The meetup ${id} could not be updated`,
            };
        }
    
        return res.status(responseDTO.code).json(responseDTO);

})




module.exports = router;