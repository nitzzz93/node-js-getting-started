const express = require('express');
const {
  MSG_INTERNAL_ERROR,
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_INVALID_CREDS,
} = require('../Utility/Message');
const User = require('../Model/User');
const JobApplication = require('../Model/JobApplication');
const Job = require('../Model/Job');
const Recruiter = require('../Model/Recruiter');

const router = express.Router();

// application routes

router.post('/apply', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
  };
  try {
    const { authorization: id } = req.headers;
    if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const user = await User.findById(id);
    if (!user) throw Error(MSG_INVALID_CREDS);

    const { jid } = req.body;

    const applicationId = await JobApplication.create({
      jid, uid: user.uid, status: 0,
    });
    if (!applicationId && applicationId !== 0) throw Error(MSG_INTERNAL_ERROR);

  

    responseObject.data = applicationId;
    responseObject.status = 'success';
    responseObject.message = '';
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});

router.get('/applied', async (req, res) => {
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
  
      const applications = await JobApplication.findApplied(user.uid);
      
      if (!applications) throw Error(MSG_INTERNAL_ERROR);
      responseObject.status = 'success';
      responseObject.message = '';
      responseObject.data = applications;
    } catch (e) {
      responseObject.status = 'failed';
      responseObject.message = e.message;
    } finally {
      res.json(responseObject);
    }
  });
  
  
  router.get('/:jid', async (req, res) => {
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
    
      const { jid } = req.params;
      const job = await Job.findById(jid);
      if (!job) throw Error(MSG_INTERNAL_ERROR);
      const isApplied = await JobApplication.find(account.uid, jid);
      if (isApplied) {
        job.isApplied = true;
      }
      responseObject.status = 'success';
      responseObject.message = '';
      responseObject.data = job;
    } catch (e) {
      responseObject.status = 'failed';
      responseObject.message = e.message;
    } finally {
      res.json(responseObject);
    }
  });

router.get('/interviews', async (req, res) => {
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

    const interviews = await JobApplication.findInterviews(user.uid);
    const results = await Promise.all(interviews.map(async (interview) => {
      const job = await Job.findById(interview.jid);
      return {
        ...interview,
        ...job,
      };
    }));

    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = results;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/interview/:id', async (req, res) => {
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

    const { jid } = req.params;
    if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const application = await JobApplication.findById(jid);
    const job = await Job.findById(application.jid);
    const company = await Recruiter.findById(job.addedBy);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = {
      ...application,
      ...job,
      companyName: company.company,
    };
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


module.exports = router;
