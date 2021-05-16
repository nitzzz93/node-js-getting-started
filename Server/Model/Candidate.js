const con = require('./connection');

class Candidate {
  static async create(candidateData) {
    const query = `INSERT INTO Candidate (uid, experience, highestEducation) 
      VALUES (
        '${candidateData.uid}',
        '${candidateData.experience}',
        '${candidateData.highestEducation}'
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

  static async findByUid(uid) {
    const query = `SELECT * FROM Candidate
    WHERE uid='${uid}'`;
    const candidate = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        resolve(result[0]);
      });
    });
    return candidate;
  }
}

module.exports = Candidate;
