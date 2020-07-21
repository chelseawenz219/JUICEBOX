
//where we listen to front-end code AJAX reqs
//also where we make requests to our database

/* SEEDING:
Making sure our data tables have all correct, req user-facing data
and no unwanted data
 */

//imports from our index!!
const { client, getUsers, createUser } = require('./index');

async function testDB(){
    try{
        console.log("Starting DB test..");
        //conect the client to database:
        // client.connect();
        //*queries are promises!
        const users = await getUsers();
        console.log("getUsers:", users);
        console.log("finished DB tests!");
    }catch (error){
        console.error("Error testing DB!");
    }
}


//call a query that drops all tables from our db.
async function dropTables(){
    try{
        console.log("starting dropTables");
        await client.query(`
        DROP TABLE IF EXISTS users;
        `)
        console.log("finish dropTables");
    }catch(error){
        console.error("Error at dropTables!");
        throw error; //we pass the error up to the function that calls dropTables;
    }
}

//call a query that creates tables for our db.
async function createTables(){
    try{
        console.log("starting to build tables..");
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
          );
        `);
        console.log("finished building tables!");
    }catch(error){
        console.error("Error at createTables");
        throw error; //passin it up
    }
}

//all together now:
async function rebuildDB(){
    try{
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    }catch (error){
        console.error(error);
        throw error;
    }
}

async function createInitialUsers(){
    try{
        console.log("Starting to create users...");
        const albert = await createUser({username: 'albert', password: 'bertie99'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam'});
        console.log(sandra);
        console.log(glamgal);
        console.log(albert);
        console.log("Finished creating users!!!");
    }catch (error){
        console.error("Error at createInitialUsers!");
        throw error;
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(()=> client.end());