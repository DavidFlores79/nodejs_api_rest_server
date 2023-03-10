const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID


const client = new OAuth2Client( CLIENT_ID );

const googleVerifyToken = async function ( id_token = '') {
  
    const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: CLIENT_ID,
  });
  const { name, picture, email } = ticket.getPayload();
  
  return { name, image: picture, email }
}

module.exports = { googleVerifyToken }
