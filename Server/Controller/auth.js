const express = require('express');
const User  = require('../Model/User');
const {
  MSG_INVALID_TOKEN,
  MSG_INVALID_CREDS,
  MSG_LOGIN_SUCCESS,
} = require('../Utility/Message');
const { Auth } = require('../Utility');

const router = express.Router();

// auth
router.post('/login', async (req, res) => {
  // check for login method >> token or data.
 
  const responseObject = {
    status: 'failed',
    message: '',
  };

  try {
    const email = req.body.username;
    const plainPassword = req.body.password;
   
      // do data login here
      const user = await User.findByMail(email);
      if (!user) throw Error(MSG_INVALID_CREDS);
      const isPasswordValid = Auth.isPasswordValid(plainPassword, user.password);
      if (!isPasswordValid) throw Error(MSG_INVALID_CREDS);
    {
      responseObject.status = 'success';
      responseObject.message = MSG_LOGIN_SUCCESS;
      responseObject.uid = Number.parseInt(user.uid);
    }
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


module.exports = router;
