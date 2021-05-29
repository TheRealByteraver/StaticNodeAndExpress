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

// make sure /project does not generate a 404
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

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404; // http 404 == not found
    next(err);
});

app.use((err, req, res, next) => {
    // reduce undefined errors to HTTP 500 Internal Server Error
    if(!err.status) {
        // we need to define the http error or the default Express error
        // handler will get triggered instead:
        err.status = 500;
        // We suppress the real error message with our own:
        //err.message = new Error('Internal Server Error');
    }
    // send http status 'err.status' (404, 500, ...) back to the browser
    res.status(err.status); 

    // render our custom error page
    res.render('error', { error: err });
    next();
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
