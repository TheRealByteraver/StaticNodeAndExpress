// configure express:
const path = require('path');
const express = require('express');
const app = express();
//app.use('/static', express.static('public')); // replaced, see below
app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // added

// import data:
const { projects } = require('./data.json');
const { components } = require('./components.json');

// handle routes:
app.get('/', (req, res) => { 
    res.render('index.pug', { projects, components });
});

app.get('/about', (req, res) => { 
    res.render('about.pug');
});

app.get('/project/:id', (req, res, next) => {
    // the id's are 1-based, but the array is 0-based 
    const index = +req.params.id;// - 1;

    // If the 'id' string provided after '/project/' is not a number 
    // or is too big or too small a number, make it a 404 error
    if((typeof index != 'number') || isNaN(index) || 
        index < 0) {
        // we can't handle this route here (it does not exist) so we go to 
        // the next middleware in the chain, which will render a 404 error
        next();
    } else {
        // check if the index is an existing one and dig up the right project:
        for (let i = 0; i < projects.length; i++) {
            if (projects[i].id === index) {
                res.render('project.pug', { project: projects[i] });
                return;
            } 
        }
        next(); // project not found, give the user a 404
    }    
});

app.get('/component/:id', (req, res, next) => {
    // the id's are 1-based, but the array is 0-based 
    const index = +req.params.id;// - 1;

    // If the 'id' string provided after '/project/' is not a number 
    // or is too big or too small a number, make it a 404 error
    if((typeof index != 'number') || isNaN(index) || 
        index < 0) {
        // we can't handle this route here (it does not exist) so we go to 
        // the next middleware in the chain, which will render a 404 error
        next();
    } else {
        // check if the index is an existing one and dig up the right component:
        for (let i = 0; i < components.length; i++) {
            if (components[i].id === index) {
                res.render('component.pug', { component: components[i] });
                return;
            } 
        }
        next(); // project not found, give the user a 404
    }    
});

// handle errors. First, if the route was not handled yet, it does not exist,
// so we create a 404 ('Not Found') error:
app.use((req, res, next) => {
    const err = new Error('The page you are looking for does not exist.🤷‍♂️');
    err.status = 404; // http 404 == not found
    next(err);        // let the error handler below handle it further
});

// handle all errors from the middleware chain:
app.use((err, req, res, next) => {
    // reduce undefined errors to HTTP 500 Internal Server Error
    if(!err.status) {
        // we need to define the http error or the default Express error
        // handler will get triggered instead:
        err.status = 500;
        // We suppress the real error message with our own;
        // comment it out for debugging.
        err.message = new Error('Internal Server Error 🙅‍♂️');
    }
    // send http status 'err.status' back to the browser
    res.status(err.status); 

    // render our custom error page
    if(err.status === 404) {
        res.render('page-not-found.pug', { error: err });
    }
    else {
        res.render('error.pug', { error: err });
    }    
});

// start server at port 3006 (for node.js multisite hosting 
// on digitalocean server with nginx proxy)
app.listen(process.env.PORT || 3006, () => {
    console.log('server is running on port ', process.env.PORT || 3006);
});