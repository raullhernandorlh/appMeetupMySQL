const nodemailer = require('nodemailer');

const sendEmail = async(mail,name)=>{

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.SECURE, 
        auth: {
            user: process.env.ETHEREAL_USER,
            pass: process.env.ETHEREAL_USER_PASSWORD
        },
      });

      let info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: mail, // list of receivers
        subject: "Register Confirmation", // Subject line
        text: `Desde AppMeetup queremos ${name} darle la bienveida . Disfrute de nuestros multiples servicios.`, // plain text body
        html: "<b>Desde <h1>AppMeetup</h1> queremos darle la bienvenida. Disfrute de nuestros multiples servicios.</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);

      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {
  sendEmail
}
