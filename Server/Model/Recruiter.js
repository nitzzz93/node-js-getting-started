const con = require('./connection');


class Recruiter {
  static async create(recruiterData) {
    const query = `INSERT INTO Recruiter (uid, position, company) 
      VALUES (
        '${recruiterData.uid}', 
        '${recruiterData.position}',
        '${recruiterData.company}'
      )
    `;

    const success = await new Promise((resolve) => {
      con.query(query, (error) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(true);
      });
    });
    return success;
  }

  static async findById(uid) {
    const query = `SELECT * FROM Recruiter
    WHERE uid = '${uid}'`;
    const recruiter = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result[0]);
      });
    });
    return recruiter;
  }

  static async findAll() {
    const query = 'SELECT * FROM Recruiter';
    const recruiters = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result);
      });
    });
    return recruiters;
  }

  static async findNew() {
    const query = `SELECT * FROM Recruiter WHERE status='${0}'`;
    const recruiters = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result);
      });
    });
    return recruiters;
  }

  static async updateStatusWithId(uid, newStatus) {
    const query = `UPDATE Recruiter
    SET status='${newStatus}' 
    WHERE uid = '${uid}'`;
    const isSuccess = await new Promise((resolve) => {
      con.query(query, (error) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(true);
      });
    });
    return isSuccess;
  }
}

module.exports = Recruiter;
