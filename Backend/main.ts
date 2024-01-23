//import base
const express = require('express');
import router from './routes/index';
import MongoStore from 'connect-mongo';
import { connectDB, ensureVerificationCodes } from './data/connectToDb';
//import passport
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
//import flash
import flash from 'express-flash';
//import other
import cors from 'cors';
//import models
import User from './data/model/user';
require('dotenv').config();

export const app = express();

//! Enable CORS for frontend Port - This is for development only!!
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    "Access-Control-Allow-Credentials": true
}));

//middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('your secret'));

// Configure session and store in MongoDB
export const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URL});
app.use(session({
    name: '__session',
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

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


