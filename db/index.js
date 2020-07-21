
//In general, in our db/index.js file we should provide
//the utility functions that the rest of our application will use.
//**init database

const { Client } = require('pg'); //imports pg
//database name and location:
const client = new Client('postgres://localhost:5432/JUICEBOX-dev');

async function getUsers(){
    const { rows } = await client.query(
        `SELECT id, username
        FROM users;`
        );
        return rows;
}

async function createUser({ username, password }) {
    try {
      const { rows } = await client.query(`
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `, [username, password]);
      //interpolation**
      //"on conflict" prevents duplicate usernames!
      return rows;
    } catch (error) {
      throw error;
    }
  }

//exports!!!!!?
module.exports = {
    client,
    getUsers,
    createUser,
}

