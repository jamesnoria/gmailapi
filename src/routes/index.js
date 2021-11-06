const { Router } = require('express');

const nodemailer = require('nodemailer');

const { google } = require('googleapis');
require('dotenv').config();

const router = Router();

router.post('/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  const contentHTML = `
    <h1>Hello There!</h1>
    <ul>
      <li>Nombre: ${name}</li>
      <li>Email: ${email}</li>
    </ul>
    <p>
      ${message}
    </p>
  `;

  const CLIENT_ID = process.env.CLIENT_ID
  const CLIENT_SECRET = process.env.CLIENT_SECRET
  const REDIRECT_URI = process.env.REDIRECT_URI
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function sendMail() {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'jamesnoria@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOptions = {
      from: "'My Nodemailer Test' <jamesnoria@gmail.com>",
      // to: 'davidvpe@gmail.com',
      to: 'jamesnoria@gmail.com',
      subject: 'From my LOCALHOST x)',
      html: contentHTML,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  }

  sendMail()
    .then((result) => res.status(200).send('email sent'))
    .catch((error) => console.log(error.message));
});

module.exports = router;
