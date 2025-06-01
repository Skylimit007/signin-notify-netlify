const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const CLIENT_ID = '755429138864-fkb57r7p2thout8qupf5g0281d0ef21d.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { token, timestamp } = JSON.parse(event.body);

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    // Configure your email transport
     const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'honest.oigo@strathmore.edu',
        pass: 'nvpu xuhn bkpd invt'
      }
    });

    // Email options
     const mailOptions = {
      from: 'youremail@gmail.com',
      to: 'nextedgeinnovations.org@gmail.com',
      subject: 'New Sign-In Alert',
      text: `User ${email} signed in at ${timestamp}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Notification sent' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
