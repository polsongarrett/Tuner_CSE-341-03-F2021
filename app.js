const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.set('view engine', 'ejs'); // change based on engine: pug, hbs, ejs
app.set('views', 'views'); // default where to find templates

// Registered routes
const errorController = require('./controllers/error');
const basicRoutes = require('./routes/basic')

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', basicRoutes);
app.use(errorController.get404);

app.listen(PORT);
console.log("Now listening on " + PORT);