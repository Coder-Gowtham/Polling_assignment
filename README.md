Title: Real-time Polling & Chat Application

**NOTE** 
Clone the apllication and checkout to master branch for running the application (git checkout master).
Execute the sql queries in the given order.


**Overview**
Provide a brief description of your application and its purpose.

**Technologies Used**
Node.js
Express.js
Socket.IO
PostgreSQL (PgAdmin)
Bootstrap5
EJS (Embedded Javascript)

**Dependencies**

_SQL SCRIPTS : Please run this queries to create required tables. PostgreSQL (PgAdmin) is used for this project_
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    createdTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE master_options (
    id SERIAL PRIMARY KEY,
    options VARCHAR(255) NOT NULL,
    vote_count INTEGER DEFAULT 0
);

INSERT INTO master_options (options, vote_count)
VALUES 
    ('C++', 0),
    ('JavaScript', 0),
    ('Python', 0),
    ('GoLang', 0),
    ('Java', 0);


CREATE TABLE registered_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255)  NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_voted BOOLEAN DEFAULT FALSE,
    selected_option INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




**Installation Instructions**
Cloning the repository from GitHub
checkout to master branch for running the application (git checkout master)
Install Node.js and npm
Install dependencies using npm (npm install)
Set up the database

**Configuration**
Inside the index.js file, configure the below as per your local setup.
const pool = new Pool({
    user: 'user',
    host: 'localhost',
    database: 'userDatabase',
    password: 'user@123',
    port: 5024,
});

**Running the Application**
Provide instructions on how to start the application:
1) checkout to master branch for running the application (git checkout master)
2) Use npm start or nodemon in the terminal
3) Access the application through a browser (http://localhost:3000)

**Usage**

1) Register using the email and password. You can use any dummy email. After registration you will be automatically logged in and taken to the home page.
2) If already registered click on login. Login using your credentials.
3) You will see a real time polling option on the left side of the screen and real time chat application on the right.
4) To check the real time functionality, you can open the app (http://localhost:3000) in multiple windows or browser with different created user.
5) A user can vote only once and will be shown a alert mesage if he tries to vote again.

**Troubleshooting**
1) You can face issue with database connection, so it is recommended to strictly use PgAdmin and run the above mentioned scripts.
2) All the dependencies should be installed properly.
3) checkout to master branch for running the application (git checkout master)
