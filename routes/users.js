//Imports
const database = require('../database');
const express = require('express');
const userService = require('../service/userService');
const validation = require('../validations/validations')
const jwt = require('jsonwebtoken');
const { userExist } = require('../service/userService');

// Defining Router
const router = express.Router();

const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const { token } = require('morgan');


// Registro de usuarios
router.post('/', async function (req, res) {

    const register = {
        'firstName': req.body.firstName,
        'lastName': req.body.lastName,
        'userImage': req.body.userImage,
        'email': req.body.email,
        'phone': req.body.phone,
        'userType': req.body.userType,
        'userAutonomousCommunity': req.body.userAutonomousCommunity,
        'userProvince': req.body.userProvince,
        'userCity': req.body.userCity,
        'organizerName': req.body.organizerName,
        'organizerAutonomousCommunity': req.body.organizerAutonomousCommunity,
        'organizerProvince': req.body.organizerProvince,
        'organizerCity': req.body.organizerCity,
        'description': req.body.description,
        'password': req.body.password
    };
    let responseDTO;
    if (await userService.userExist(req.body.email)) {
        const responseDTO = {
            'code': 200,
            'description': 'El usuario (email) ya existe'
        };
        res.status(responseDTO.code).json(responseDTO);
        return;
    }

    try {
        validation.registerValidation(register);


    } catch (e) {
        res.status(400).send();
        return
    }

    if (await userService.registerUser(register)) {
        responseDTO = {
            'code': 200,
            'description': 'Uusario creado correctamente',
            'data': register
        };
    } else {
        responseDTO = {
            'code': 404,
            'description': 'No se ha podido registrar el usuario',
        };
    }

    return res.status(responseDTO.code).json(responseDTO);
});

// Login de usuarios
router.post('/login', async function (req, res) {
    const email = req.body.email;
    const pass = req.body.pass;

    // Logearse with Admin (Only one on the appmeetup)

    const sqlUserTypeAdmin = "SELECT  user_type FROM users WHERE email = ?"
    const connection = await database.connection();
    const [rows] = await connection.execute(sqlUserTypeAdmin, [email]);

    if (rows[0].user_type === 'admin') {
        const tokenPayload = { role: rows[0].user_type };
        try {
            const token = await jwt.sign(tokenPayload, process.env.SECRET, {
                expiresIn: '1d'
            });
            res.json({
                token

            })
        }
        catch (e) {
            console.log(e)
        }

    }


    // Login with other type_user (User or Organizer)
    if (rows[0].user_type !== 'admin') {

        const user = userExist(email);

        if (!user) {
            res.status(404).send();
            return;
        }

        const sqlUserAttributesForToken = "SELECT  id, email ,user_type FROM users WHERE email = ?"
        const [rows] = await connection.execute(sqlUserAttributesForToken, [email]);
        rows.forEach(row => {

            const tokenPayload = {
                id: row.id,
                email: row.email,
                role: row.user_type
            }
        console.log(tokenPayload);

            try {
                const token = jwt.sign(tokenPayload, process.env.SECRET, {
                    expiresIn: '1d'
                });

                res.json({
                    token
                })
            }
            catch (e) {
                console.log(e);
            }
        })

    }

    const responseDTO = await userService.loginUser(email, pass)
    res.status(responseDTO.code).json(responseDTO);
});



// Eliminar usuarios

router.delete('/:usertype/:id', isAuthenticated, isAdmin, async function (req, res) {

    const id = parseInt(req.params.id);
    const usertype = req.params.usertype

    if (id === undefined || usertype === undefined) {
        res.status(402).send();
        return
    }

    const result = userService.deleteUser(id, usertype);
    res.send();
})


// Detail User

router.get('/user/:id', isAuthenticated, isAdmin, async function (req, res) {

    const id = parseInt(req.params.id);

    const responseDTO = await userService.userList(id);
    res.status(responseDTO.code).json(responseDTO);
})


// List Users 

router.get('/listusers', isAuthenticated, isAdmin, async function (req, res) {
    const listUsers = await userService.listUsers();
    const responseDTO = {
        'code': 200,
        'data': listUsers
    };

    return res.status(responseDTO.code).json(responseDTO);
})

module.exports = router;
