
  const express = require('express');
  const path = require('path');
  const bodyParser = require('body-parser');
  
  const {
    userRouter,
    authRouter,
    jobRouter,
    recruiterRouter,
    jobApplicationRouter,
  } = require('./Controller');
  
  
  const app = express();
  app.use(express.static(path.join(__dirname, '../views')));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
 
  
  app.use('/user', userRouter);
  app.use('/auth', authRouter);
  app.use('/recruiter', recruiterRouter);
  app.use('/job', jobRouter);
  app.use('/jobapplication', jobApplicationRouter);
  app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
  }); 
  app.post('/resetSession', function (req, res) {
    req.session.destroy();
    res.sendStatus(200);
    });
  
  
  module.exports = function startServer(PORT) {
    app.listen(PORT, () => {
      console.log(`\n\n****** Server started on ${PORT} ********\n\n`);
    });
  };
  
  