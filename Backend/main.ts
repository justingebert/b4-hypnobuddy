const express = require('express');
import router from './routes/index';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';
import cors from 'cors';
import User from './data/model/user';
require('dotenv').config();

export const app = express();

//! Enable CORS for frontend Port - This is for development only!!
app.use(cors({
    origin: true,
    credentials: true,
    "Access-Control-Allow-Credentials": true,
    allowedHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie',
}));

//middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('your_secret_key'));

// Configure session and store in MongoDB
export const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/hypnobuddy'});

app.use(session({
    name: 'session',
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        proxy: true,//process.env.NODE_ENV === 'production',
        httpOnly: true,
        secure: true, //process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.set('trust proxy', 1);

//setup passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req: any, res, next: Function) => {
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.flashMessages = req.flash();
    next();
});

//setup routes
app.use('/', router);


