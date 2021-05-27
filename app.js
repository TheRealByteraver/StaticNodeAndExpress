const express = require('express');
const data = require('./data.json');


const app = express();


app.use(express.json());                         // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
//app.use(cookieParser());

// tell express that static content sits inside the 'public' folder.
// This means the contents of the public folder is now available as root 
// route. I.e. the file public/css/styles.css is available as 
// http://domain.tld/css/styles.css. If there is a 'css' route and this
// causes a conflict, you can remap this to a custom route (e.g. 'static')
// as shown below. The '/static' parameter is optional. 
app.use(express.static('public'));

app.set('view engine', 'pug');
//app.set('views', './views');    // 'views' is the default subfolder so this is optional

// include routes from the 'routes' directory. 
// index.js is the default name and thus './routes' would suffice.
// const mainRoutes = require('./routes/index.js'); 

app.get('/', (req,res) => { // render "Home"
    console.log(data.projects);
    res.send('Hello world');
});

app.get('/about', (req,res) => { // render "About"
    res.send('Hello world');
});



app.listen(3000, () => {
    console.log("server is running on port 3000");
});
