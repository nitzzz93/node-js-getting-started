const con = require('./connection');

// status --- 0 - applied, 1 - accepted, 2 - rejected

class JobApplication {


  static async create(applicationData) {
    const query = `INSERT INTO JobApplication (jid, uid, status, message) 
      VALUES (
        '${applicationData.jid}', 
        '${applicationData.uid}',
        '${applicationData.status}',
        '${applicationData.message}'
      )
    `;

    const applicationId = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result.insertId);
      });
    });
    return applicationId;
  }


  static async findApplied(user) {
    const query = `SELECT * FROM jobapplication AS JA
    INNER JOIN  user AS U
    on JA.id = U.uid
    INNER JOIN job AS J
    on J.jid = JA.jid
    WHERE J.addedBy = ${user}`;
    const application = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return application;
  }


  static async findById(id) {
    const query = `SELECT * FROM JobApplication
    WHERE id='${id}'`;
    const applications = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result[0]);
      });
    });
    return applications;
  }

  static async findByJid(jid) {
    const query = `SELECT * FROM JobApplication
    WHERE jid='${jid}'`;
    const applications = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return applications;
  }


  static async findByUid(uid) {
    const query = `SELECT * FROM JobApplication
    WHERE uid='${uid}'`;
    const applications = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return applications;
  }


  static async updateJobStatus(jid,status) {
    const query = `UPDATE Job
    SET status = '${status}'
    WHERE jid='${jid}'`;
    const success = await new Promise((resolve) => {
      con.query(query, (error) => {
        if (error) throw error;
        resolve(true);
      });
    });
    return success;
  }
}

module.exports = JobApplication;
