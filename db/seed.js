
//where we listen to front-end code AJAX reqs
//also where we make requests to our database

/* SEEDING:
Making sure our data tables have all correct, req user-facing data
and no unwanted data
 */

//imports from our index!!
const { client, getUsers, createUser, updateUser, getPosts, createPost, updatePost, getPostsByUser, getUserById, createPostTag, addTagsToPost, getPostById, getPostsByTagName } = require('./index');




//call a query that drops all tables from our db.
async function dropTables(){
    try{
        console.log("starting dropTables");
        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
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
        console.log("starting to build user tables..");
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location varchar(255) NOT NULL,
            active boolean DEFAULT true
        );

        CREATE TABLE posts(
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        
        CREATE TABLE tags(
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL
        );

        CREATE TABLE post_tags(
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id),
            UNIQUE ("postId", "tagId")
        );
        `);
        console.log("finished building tables!");
    }catch(error){
        console.error("Error at createTables");
        throw error; //passin it up
    }
}

async function createInitialUsers(){
    try{
        console.log("Starting to create users...");
        await createUser({
            username: 'chelseaUNICORN',
            password: 'password123',
            name: 'Chelsea',
            location: 'St Johns, Florida'
        });
        await createUser({
            username: 'chelseaBEAR',
            password: 'password456',
            name: 'Chels',
            location: 'Jacksonville, Florida'
        });
        await createUser({
            username: 'chelseaDOLPHIN',
            password: 'password789',
            name: 'Chelzeee',
            location: 'Jacksonville, Florida'
        });

        console.log("Finished creating users!!!");
    } catch (error) {
        console.error("Error at createInitialUsers!");
        throw error;
    }
}

async function createInitialPosts(){
    try{
        const [chelseaUNICORN, chelseaBEAR, chelseaDOLPHIN] = await getUsers();

        await createPost({
            authorId: chelseaUNICORN.id,
            title: "First post",
            content: "The very first post!",
            tags: ["#1stplace", "#sweet"]
        });

        await createPost({
            authorId: chelseaBEAR.id,
            title: "Coming in Second",
            content: "I made the second post",
            tags: ["#second", "#notfirstyourelast"]
        });

        await createPost({
            authorId: chelseaDOLPHIN.id,
            title: "Honorable mention",
            content: "Late to the party.",
            tags: ["#whyamihere", "#epicfail"]
        });
        console.log("Finished creating posts!!");
    } catch(error) {
        console.log("Error at creating initial posts!!");
        throw error;
    }
}

//all together now:
async function rebuildDB(){
    try{
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    }catch (error){
        console.error(error);
        throw error;
    }
}

async function testDB(){
    try{
        console.log("Starting DB test..");
        //conect the client to database:
        // client.connect();
        //*queries are promises!

        //testing getUser:
        const users = await getUsers();
        console.log("getUsers:", users);
        console.log("calling update user on users[0]")

        //testing updateUser:
        const updateUserResult = await updateUser(users[0].id, {
            name: "CHELSEA IN THE HOUSE",
            location: "PLANET SUPER AWESOME"
        });
        console.log("result:", updateUserResult);

        //testing getPosts:
        console.log("calling getPosts!");
        const posts = await getPosts();
        console.log("posts:", posts);

        //testing updatePost:
        console.log("Calling updatePost on posts[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[0].id, {
            tags: ["#youcandoanything", "#redfish", "#bluefish"]
        });
    console.log("Result:", updatePostTagsResult);

        //testing getuserbyid:
        console.log("calling getUserBy...");
        const chelseaUNICORN = await getUserById(1);
        console.log("getUserResult:", chelseaUNICORN);

        //test getPostByTag:
        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Result:", postsWithHappy);

        //done
        console.log("finished DB tests!");

    }catch (error){
        console.error("Error testing DB!");
        throw error;
    }
}




rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(()=> client.end());