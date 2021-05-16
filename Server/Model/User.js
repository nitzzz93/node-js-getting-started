const con = require('./connection');

// User role:
//   # 1 - Recruiter
//   # 2 - Candidate

class User {
  static async create(userData) {
    const query = `INSERT INTO User (email, password, name,mobile,role) 
      VALUES (
        '${userData.email}', 
        '${userData.password}',
        '${userData.name}', 
        '${userData.mobile}',
        '${userData.role}'
        )`;
    const uid = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result.insertId);
      });
    
    });
    return uid;
  }

  static async findByMail(email) {
    const query = `SELECT * FROM User
    WHERE email = '${email}'`;
    const user = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        // id = result.insertId;
        resolve(result[0]);
      });
     
    });
    return user;
  }

  static async findById(uid) {
    const query = `SELECT * FROM User
    WHERE uid = '${uid}'`;
    const user = await new Promise((resolve) => {
      con.query(query, (error, result) => {
        if (error) throw error;
        //id = result.insertId;
        resolve(result[0]);
      });
     
    });
    return user;
  }
}

module.exports = User;
