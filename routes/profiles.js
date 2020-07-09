//Imports

const express = require('express');
const profileService = require('../service/profileService');
const validation = require('../validations/validations');

// Import Auth Middleware

const { isAuthenticated, isUserOfThisOrganizerProfile,isUserOfThisUserProfile } = require('../middlewares/auth');

// Defining Router
const router = express.Router();


// Update User Profile

router.put('/user/:id', isAuthenticated,isUserOfThisUserProfile, async function (req, res) {

    const id = parseInt(req.params.id);
    console.log(id);

    //Checking if the id is undefined

    if (id === undefined) {
        res.status(404).send();
        return
    }

    // Watch out !!!!! . It is not allowed to change the email because we use it as an identifier for the login
    
    const userProfile = {
        'firstName': req.body.firstName,
        'lastName': req.body.lastName,
        'userImage': req.body.userImage,
        'userAutonomousCommunity': req.body.userAutonomousCommunity,
        'userProvince': req.body.userProvince,
        'userCity': req.body.userCity,
        'phone': req.body.phone
    };

     // Checking if the organizer profile attributes are undefined

     if (userProfile.firstName === undefined || userProfile.lastName === undefined
        || userProfile.userImage === undefined || userProfile.userAutonomousCommunity === undefined
        || userProfile.userCity === undefined|| userProfile.phone === undefined) {
        res.status(400).send();
        return;
    }

     // User Profile Validation

     try {
        validation.userProfileValidation(userProfile)

    } catch (e) {
        console.log('hola');
        console.log(e)
        res.status(400).send();
        return
    }


    let responseDTO;
    if (await profileService.updateUserProfile(id, userProfile)) {
        responseDTO = {
            'code': 200,
            'description': `User Profile ${id} successfully updated`,
            'data': userProfile
        };
    } else {
        responseDTO = {
            'code': 404,
            'description': `The User Profile ${id} could not be updated`,
        };
    }

    return res.status(responseDTO.code).json(responseDTO);

})


// Update Organizer Profile

router.put('/organizer/:id', isAuthenticated, isUserOfThisOrganizerProfile,async function (req, res) {

    const id = parseInt(req.params.id);
    console.log(id);

    //Checking if the id is undefined

    if (id === undefined) {
        res.status(404).send();
        return
    }

    const organizerProfile = {
        'organizerName': req.body.organizerName,
        'organizerAutonomousCommunity': req.body.organizerAutonomousCommunity,
        'organizerProvince': req.body.organizerProvince,
        'organizerCity': req.body.organizerCity,
        'description': req.body.description,
    };


    // Checking if the organizer profile attributes are undefined

    if (organizerProfile.organizerName === undefined || organizerProfile.organizerAutonomousCommunity === undefined
        || organizerProfile.organizerProvince === undefined || organizerProfile.organizerCity === undefined
        || organizerProfile.description === undefined) {
        res.status(400).send();
        return;
    }

    // Organizer Profile Validation
    try {
        validation.organizerProfileValidation(organizerProfile)

    } catch (e) {
        console.log(e)
        res.status(400).send();
        return
    }

    let responseDTO;
    if (await profileService.updateOrganizerProfile(id, organizerProfile)) {
        responseDTO = {
            'code': 200,
            'description': `Organizer Profile ${id} successfully updated`,
            'data': organizerProfile
        };
    } else {
        responseDTO = {
            'code': 404,
            'description': `The Organizer Profile ${id} could not be updated`,
        };
    }

    return res.status(responseDTO.code).json(responseDTO);

})


// Detail Organizer Profile

router.get('/organizer/:id', isAuthenticated, isUserOfThisOrganizerProfile,async function (req, res) {

    const id = parseInt(req.params.id);

    const responseDTO = await profileService.organizerProfileDetail(id);
    res.status(responseDTO.code).json(responseDTO);

})

// Detail User Profile

router.get('/user/:id', isAuthenticated,isUserOfThisUserProfile,async function (req, res) {

    const id = parseInt(req.params.id);

    const responseDTO = await profileService.userProfileDetail(id);
    res.status(responseDTO.code).json(responseDTO);

})




module.exports = router;



