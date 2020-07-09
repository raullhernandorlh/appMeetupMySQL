
//Imports
const Joi = require('@hapi/joi'); // Validations

async function registerValidation(register) {


    const schema = Joi.object().keys({
        firstName: Joi.string().min(3).max(30).required(),
        lastName: Joi.string().min(3).max(30).required(),
        userImage:Joi.string().allow('', null),
        userAutonomousCommunity: Joi.string().min(3).max(30).required(),
        userProvince: Joi.string().min(3).max(30).required(),
        userCity: Joi.string().min(3).max(30).required(),
        phone: Joi.string().max(9).allow('', null),
        email: Joi.string().pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/),
        password: Joi.string().pattern(/^(?=^.{6,}$)(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).*/),
        userType: Joi.string().min(3).max(30).required(),
        organizerName: Joi.string().allow('', null),
        organizerAutonomousCommunity: Joi.string().allow('', null),
        organizerProvince: Joi.string().allow('', null),
        organizerCity: Joi.string().allow('', null),
        description: Joi.string().allow('', null)
    })

    try{
        const value = await schema.validateAsync(register);

    }catch (e) {
        console.log(e);
    }
    

}

async function meetupValidation(meetup) {

    const schema = Joi.object({
        title: Joi.string().max(200).required(),
        date:Joi.string().required(),
        time:Joi.string().required(),
        location: Joi.string().required(),
        duration: Joi.number().required(),
        category: Joi.string().min(3).max(50).required(),
        meetupPrincipalImage: Joi.string().max(500).required(),
        meetupSecondImage: Joi.string().allow('', null),
        meetupThirdImage: Joi.string().allow('', null),
        meetupPrice: Joi.number().required(),
        description: Joi.string().max(500),
        idOrganizer: Joi.number().allow('', null),
    })

    const value = await schema.validateAsync(meetup);
}

async function meetupUpdateValidation (meetup){

    const schema = Joi.object({
        date:Joi.string().required(),
        time:Joi.string().required(),
        location:Joi.string().required(),
        duration: Joi.number().required(),
        meetupPrincipalImage: Joi.string().max(500).required(),
        meetupSecondImage: Joi.string().allow('', null),
        meetupThirdImage: Joi.string().allow('', null),
        meetupPrice: Joi.number().required(),
        description: Joi.string().max(500),
    })

    const value = await schema.validateAsync(meetup);
}


async function userProfileValidation(userProfile) {

    const schema = Joi.object().keys({
        firstName: Joi.string().min(3).max(60),
        lastName: Joi.string().min(3).max(60),
        userImage: Joi.string().min(3).max(60),
        userAutonomousCommunity: Joi.string().min(3).max(60),
        userProvince: Joi.string().min(3).max(400),
        userCity: Joi.string().min(3).max(400),
        phone: Joi.string().min(3).max(400),
    })

    const value = await schema.validateAsync(userProfile);

}


async function organizerProfileValidation(organizerProfile) {

    const schema = Joi.object().keys({
        organizerName: Joi.string().min(3).max(60),
        organizerAutonomousCommunity: Joi.string().min(3).max(60),
        organizerProvince: Joi.string().min(3).max(60),
        organizerCity: Joi.string().min(3).max(60),
        description: Joi.string().min(3).max(400),
    })

    const value = await schema.validateAsync(organizerProfile);

}
 
async function reservationValidation(reservation){

    const schema = Joi.object().keys({


    })

    const value = await schema.validateAsync(reservation)
}


async function paymentValidator (payment){
    

    const schema = Joi.object().keys({
        creditCardNumber: Joi.number().min(1234564378915672).max(9999999999999999), 
        expirationMonth:Joi.number().min(1).max(12),
        expirationYear:Joi.number().min(2020).max(2028),
        securityCode:Joi.number().min(100).max(999)

    })

    const value = await schema.validateAsync(payment);


}



module.exports = {
    registerValidation,
    meetupValidation,
    meetupUpdateValidation,
    organizerProfileValidation,
    userProfileValidation
}