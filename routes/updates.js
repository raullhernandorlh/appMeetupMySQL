//Imports

const express = require('express');
const updateService = require('../service/updateService');

// Defining Router
const router = express.Router();

// Add Updates

router.post('/:id', async function (req, res) {

    const id = parseInt(req.params.id);
    const bodyUpdate = req.body.update;
    
    const update = {
        'update': bodyUpdate,
        'idMeetup':id
    };

    let responseDTO;
    if (await updateService.addUpdate(update) ){
        responseDTO = {
            'code': 200,
            'description': 'Update created correctly',
            'data': update
        };
    } else {
        responseDTO = {
            'code': 404,
            'description': 'Could not create update',
        };
    }

    return res.status(responseDTO.code).json(responseDTO);
})

module.exports = router;