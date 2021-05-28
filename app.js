const express = require('express');

const app = express();

app.use(express.json());                         // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use('/static', express.static('public'));

const data = require('./data.json');

app.set('view engine', 'pug');

// include routes from the 'routes' directory. 
// index.js is the default name and thus './routes' would suffice.
// const mainRoutes = require('./routes/index.js'); 

app.get('/', (req,res) => { 
    res.render('index.pug', { projects: data.projects });
});

app.get('/about', (req,res) => { 
    res.render('about.pug');
});

// the below route does not handle '/project/' !
app.get('/project/:id', (req, res) => {
    // the id's are 1-based, but the array is 0-based
    const index = req.params.id - 1;
    //console.log(`data[${index}]`, data.projects[index]);
    res.render('project.pug', { project: data.projects[index] });
});

// Todo: handle 404 errors
// The 404 handler should create a custom new Error(), set its status property 
// to 404 and set its message property to a user friendly message. Then the 404 
// handler should log out the new error's message and status properties.

// Todo: handle server errors
// After the 404 handler in app.js add a global error handler that will deal 
// with any server errors the app encounters. This handler should ensure that 
// there is an err.status property and an err.message property if they don't 
// already exist, and then log out the err object's message and status.

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
