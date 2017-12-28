'use strict';

require('dotenv').config();

import express from 'express';
import http from 'http';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const whitelist = ['http://primetablestk.com', 'http://www.primetablestk.com'];
const corsOptions = {
  origin: function (origin, cb) {
    if (whitelist.indexOf(origin) !== -1) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  }
}

app.use(morgan('dev'));
app.enable('trust proxy');
app.use(helmet());
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(favicon(path.join(__dirname, '../public/images/favicon.ico')));
app.use(express.static(path.join(__dirname, '../public')));
// app.set('view engine', 'ejs');

app.use('/api', cors(corsOptions), require('./yelp'));
app.use('/', (req, res) => {
  res.send(path.join(__dirname, '../index.html'));
});


server.listen(port, err => {
  console.log(err || `Listening on port ${port}`);
});
