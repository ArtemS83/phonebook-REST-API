const Mailgen = require('mailgen');

class EmailService {
  #createTemplateVerifyEmail(token, name) {
    const mailGenerator = new Mailgen({
      theme: 'salted',
      product: {
        name: 'Phonebook',
        link: this.link,
      },
    });
    const email = {
      body: {
        name,
        intro: "Welcome to Phonebook! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Phonebook, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${token}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    // Generate an HTML email with the provided contents
    return mailGenerator.generate(email);
  }
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;
      case 'production':
        this.link = 'https://phonebook-my-api.herokuapp.com';
        break;
      default:
        this.link = 'http://localhost:3000';
        break;
    }
  }
  async sendVerifyPasswordEmail(token, email, name) {
    const emailBody = this.#createTemplateVerifyEmail(token, name);
    const result = await this.sender.send({
      to: email,
      subject: 'Verify your account',
      html: emailBody,
    });
    // console.log('sendVerifyPasswordEmail', result);
  }
}

module.exports = EmailService;
