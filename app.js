const express = require('express');

const app = express();

app.use(express.json());                         // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

app.use('/static', express.static('public'));

const { projects } = require('./data.json');

app.set('view engine', 'pug');

// root route
app.get('/', (req,res) => { 
    res.render('index.pug', { projects });
});

// 'about' route
app.get('/about', (req,res) => { 
    res.render('about.pug');
});

// make sure '/project' does not generate a 404
app.get('/project', (req, res) => {
    res.redirect('/project/1');
});

// '/project/#' route where '#' is a number between 1 and 5
app.get('/project/:id', (req, res) => {
    // the id's are 1-based, but the array is 0-based. If the id is 
    // out of range then we default to the first project   
    const index = +req.params.id - 1;

    // If the 'id' string provided after '/project/' is not a number 
    // or is too big or too small a number, redirect to '/project/1'
    if((typeof index != 'number') || isNaN(index) || 
        index < 0 || index >= projects.length) {
        res.redirect('/project/1');
    } else {
        res.render('project.pug', { project: projects[index] });
    }    
});

// handle 404: user requested non-existing route
app.use((req, res, next) => {
    const err = new Error('The page you are looking for does not exist.🤷‍♂️');
    err.status = 404; // http 404 == not found
    res.render('page-not-found.pug', {error: err});
    next(err);
});

app.use((err, req, res, next) => {
    // reduce undefined errors to HTTP 500 Internal Server Error
    if(!err.status) {
        // we need to define the http error or the default Express error
        // handler will get triggered instead:
        err.status = 500;
        // We suppress the real error message with our own.
        // Comment it out for debugging.
        err.message = new Error('Internal Server Error 🙅‍♂️');
    }
    // send http status 'err.status' back to the browser
    res.status(err.status); 

    // render our custom error page
    res.render('error.pug', { error: err });
    next(err);
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
