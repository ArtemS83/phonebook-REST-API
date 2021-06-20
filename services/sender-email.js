const sendgridMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const config = require('../config/config');

require('dotenv').config();

class CreateSenderSendgrid {
  async send(msg) {
    sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

    return await sendgridMail.send({ ...msg, from: config.email.sendgrid });
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const options = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: config.email.nodemailer,
        pass: process.env.EMAIL_PASSWORD,
      },
      // что не было ошибки -self signed certificate in certificate chain
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport(options);
    const emailOptions = {
      from: config.email.nodemailer,
      ...msg,
    };

    return await transporter.sendMail(emailOptions);
  }
}

module.exports = { CreateSenderSendgrid, CreateSenderNodemailer };
