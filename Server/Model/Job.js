const con = require('./connection');

// status --- 0 - available, 1 - applied, 2 - positiion filled
class Job {

  static async create(jobData) {
    const query = `INSERT INTO Job (addedBy, title, description, location,status) 
      VALUES (
        '${jobData.addedBy}', 
        '${jobData.title}',
        '${jobData.description}',
        '${jobData.location}',
        '0'
      )
    `;
    const jid = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result.insertId);
      });
    });
    return jid;
  }

  static async findById(jid) {
    const query = `SELECT * FROM Job
    WHERE jid='${jid}'`;
    const job = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result[0]);
      });
    });
    return job;
  }

  static async find(location, tag) {
    let query = `SELECT * FROM Job
    WHERE location = '${location}'`;
    if (tag) {
      query += ` AND tag='${tag}'`;
    }
    const jobs = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return jobs;
  }

  static async findAvailable(user) {
    let query = `SELECT * FROM JOB 
              WHERE jid NOT IN (SELECT jid FROM jobapplication
              WHERE uid = ${user})`;
    
    const jobs = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return jobs;
  }


  static async findByRecruiter(uid) {
    const query = `SELECT * FROM Job
    WHERE addedBy='${uid}'`;
    const jobs = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result);
      });
    });
    return jobs;
  }
}


module.exports = Job;
