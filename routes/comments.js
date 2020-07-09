//Imports

const express = require('express');
const commentService = require('../service/commentService');

// Defining Router
const router = express.Router();

// Add Comments

router.post('/:id', async function (req, res) {

    const id = parseInt(req.params.id);
    const bodyComment = req.body.comment;
    
    const comment = {
        'update': bodyComment,
        'idMeetup':id
    };

    let responseDTO;
    if (await commentService.addComment(comment) ){
        responseDTO = {
            'code': 200,
            'description': 'Comment created correctly',
            'data': comment
        };
    } else {
        responseDTO = {
            'code': 404,
            'description': 'Could not create comment',
        };
    }

    return res.status(responseDTO.code).json(responseDTO);
})

module.exports = router;