const express = require('express');
const {
  MSG_INTERNAL_ERROR,
  MSG_DATA_INSUFFICIENT_ERROR,
  MSG_INVALID_CREDS,
} = require('../Utility/Message');
const User = require('../Model/User');
const Candidate = require('../Model/Candidate');
const Recruiter = require('../Model/Recruiter');
const Job = require('../Model/Job');
const JobApplication = require('../Model/JobApplication');

const router = express.Router();


router.get('/', async (req, res) => {
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

    const recruiter = await Recruiter.findById(user.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);
    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = recruiter;
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/applicant/:id', async (req, res) => {
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

    const applicant = await Application.findById(Number.parseInt(req.params.id, 10));
    if (!applicant) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    
    const candidateProfile = await Candidate.findByUid(applicant.uid);

    responseObject.status = 'success';
    responseObject.message = '';
    responseObject.data = {
      ...applicant,
      ...user,
      ...candidateProfile,
    };
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
    responseObject.data = null;
  } finally {
    res.json(responseObject);
  }
});


router.put('/applicant', async (req, res) => {
  const responseObject = {
    status: 'failed',
    message: MSG_INTERNAL_ERROR,
  };
  try {
    const { authorization: id } = req.headers;
    if (!id) throw Error(MSG_DATA_INSUFFICIENT_ERROR);
    const user = await User.findById(id);
    if (!user) throw Error(MSG_INVALID_CREDS);

    const recruiter = await Recruiter.findById(user.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);

    const { jid, status, message } = req.body;
    const isSuccess = await JobApplication.updateStatus(jid, status, message);
    if (!isSuccess) throw Error('Could not update');

    responseObject.status = 'success';
    responseObject.message = 'Updated successfuly';
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/job', async (req, res) => {
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

    const recruiter = await Recruiter.findById(user.uid);
    if (!recruiter) throw Error(MSG_INTERNAL_ERROR);
    const jobs = await Job.findByRecruiter(user.uid);
    responseObject.status = 'success';
    responseObject.message = '';
    if (jobs) {
      responseObject.data = jobs;
    }
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
  } finally {
    res.json(responseObject);
  }
});


router.get('/job/:id', async (req, res) => {
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
    const job = await Job.findById(Number.parseInt(req.params.id, 10));
    const applicants = await JobApplication.findByJid(Number.parseInt(req.params.id, 10));

    job.applicants = [];
    if (applicants) {
      job.applicants = await Promise.all(applicants.map(async (applicant) => {
        const user = await User.findById(applicant.uid);
        const candidate = await Candidate.findByUid(applicant.uid);
        return {
          ...applicant,
          ...user,
          ...candidate,
        };
      }));
    }
    responseObject.status = 'success';
    responseObject.message = '';
    if (job) {
      responseObject.data = job;
    }
  } catch (e) {
    responseObject.status = 'failed';
    responseObject.message = e.message;
    responseObject.data = null;
  } finally {
    res.json(responseObject);
  }
});


router.post('/job/new', async (req, res) => {
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

    const {
      title, description, location,
    } = req.body;

    if (![title, description, location, tag].some((e) => !!e)) {
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


module.exports = router;
