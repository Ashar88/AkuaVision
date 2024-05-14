const express = require('express');

const cors = require('cors');
const compression = require('compression'); 
const morgan = require('morgan'); 

const cookieParser = require('cookie-parser');
const uploadApiRouter = require('./routes/uploadRoutes/routes');

const fileUpload = require('express-fileupload');
// create our Express app
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.use(compression());

app.use('/api', uploadApiRouter);

// done! we export it so we can start the site in start.js
module.exports = app;
