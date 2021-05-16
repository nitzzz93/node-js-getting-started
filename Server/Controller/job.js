const express = require('express');
const {
  MSG_INTERNAL_ERROR,
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_INVALID_CREDS,
} = require('../Utility/Message');
const User = require('../Model/User');
const Job = require('../Model/Job');
const Recruiter = require('../Model/Recruiter');

const router = express.Router();

router.post('/new', async (req, res) => {
    const responseObject = {
      status: 'failed',
      message: MSG_INTERNAL_ERROR,
      data: null,
    };
    try {
        const { authorization: id } = req.headers;
        if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
        const user = await User.findById(id);
        if (!user) throw Error(MSG_INVALID_CREDS);
  
      const recruiter = await Recruiter.findById(user.uid);
      if (!recruiter) throw Error(MSG_INTERNAL_ERROR);
      
      const userData = req.body;
      if (!userData) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
  
      const {
        title,
        description, 
        location,
      } = userData;
  
      if (![title, description, location].some((e) => !!e)) {
        throw Error(MSG_DATA_INSUFFICIENT_ERROR);
      }
      const jobId = await Job.create({
        addedBy: user.uid, title, description, location,
      });
      if (!jobId && jobId !== 0) throw Error(MSG_INTERNAL_ERROR);
  
      responseObject.status = 'success';
      responseObject.message = '';
      responseObject.data = {
        jid: jobId,
      };
    } catch (e) {
      responseObject.status = 'failed';
      responseObject.message = e.message;
    } finally {
      res.json(responseObject);
    }
  });

router.get('/search/', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: [],
  };
  try {
    const { authorization: id } = req.headers;
        if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
        const user = await User.findById(id);
        if (!user) throw Error(MSG_INVALID_CREDS);

    const { location, tag } = req.query;
    const jobs = await Job.find(location, tag);
    if (!jobs) throw Error(MSG_INTERNAL_ERROR);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = jobs;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});

router.get('/all', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
    data: [],
  };
  try {
    const { authorization: id } = req.headers;
    if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const user = await User.findById(id);
    if (!user) throw Error(MSG_INVALID_CREDS);

    const jobs = await Job.findAvailable(user.uid);
    if (!jobs) throw Error(MSG_INTERNAL_ERROR);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = jobs;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


module.exports = router;
