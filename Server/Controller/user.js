const express = require('express');
const {
   User, Candidate, Recruiter,
} = require('../Model');
const {
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_DUPLICATE_EMAIL_ERROR,
  MSG_INTERNAL_ERROR,
  MSG_SIGNUP_SUCCESS,
} = require('../Utility/Message');
const { Auth } = require('../Utility');


const router = express.Router();

router.post('/new', async (req, res) => {
  // register a new user here
  const responseObject = {
    status: 'failed',
    message: MSG_DATA_INSUFFICIENT_ERROR,
  };

  const userData = req.body;
  try {
    if (!userData) throw Error(MSG_DATA_INSUFFICIENT_ERROR);

    const {
      firstName,
      lastName,
      email,
      userType,
      mobile,
    } = userData;
    const plainPassword = userData.password;

    if (!([firstName, lastName, email, plainPassword, userType, mobile].every((e) => e))) {
      throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    }

    const password = await Auth.getHash(plainPassword);
    if (!password) throw Error(MSG_INTERNAL_ERROR);

    if (userType === "1") {
      // register the recruiter
      const { position, company } = userData;

      if (!([position, company].every((e) => e))) {
        throw Error(MSG_DATA_INSUFFICIENT_ERROR);
      }

      const uid = await User.create({
        email,
        password,
        name: `${firstName} ${lastName}`,
        mobile: Number.parseInt(mobile, 10),
        role: 1,
      });

      if (!uid) throw Error(MSG_DUPLICATE_EMAIL_ERROR);

      const isRecruiterEntrySuccess = await Recruiter.create({
        uid,
        position,
        company,
      });

      if (!isRecruiterEntrySuccess) throw Error(MSG_INTERNAL_ERROR);
      responseObject.data = uid;
      responseObject.status = 'success';
      responseObject.message = MSG_SIGNUP_SUCCESS;
    } 
    else {
      // register the candidate
      const {
         highestEducation, experience,
      } = userData;

      if (!([highestEducation, experience].every((e) => e))) {
        throw Error(MSG_DATA_INSUFFICIENT_ERROR);
      }
      const uid = await User.create({
        email,
        password,
        name: `${firstName} ${lastName}`,
        mobile: Number.parseInt(mobile, 10),
        role: 2,
      });

      if (!uid) throw Error(MSG_DUPLICATE_EMAIL_ERROR);

      const isCandidateEntrySuccess = await Candidate.create({
        uid,
        experience: Number.parseInt(experience, 10),
        highestEducation,
      });

      if (!isCandidateEntrySuccess) throw Error(MSG_INTERNAL_ERROR);
      responseObject.data = uid;
      responseObject.status = 'success';
      responseObject.message = MSG_SIGNUP_SUCCESS;
    }
  } catch (e) {
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});

router.get('/:id', async (req, res) => {
    const responseObject = {
      status: 'failed',
      message: MSG_INTERNAL_ERROR,
    };
  
    try {
      const { id } = req.params;
      if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
      const user = await User.findById(parseInt(id, 10));
      if (!user) throw Error(MSG_INVALID_CREDS);
  
      responseObject.status = 'success';
      responseObject.message = 'success';
      responseObject.data = {
        user,
      };
    } catch (e) {
      responseObject.status = 'failed';
      responseObject.message = e.message;
    } finally {
      res.json(responseObject);
    }
  });

  module.exports = router;
