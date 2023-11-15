//import base
const express = require('express');
import router from './routes/index';
import MongoStore from 'connect-mongo';
import { connectDB } from './data/connectToDb';
//import passport
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

//import flash
import flash from 'express-flash';
//other imports
import cors from 'cors';
//import models
import User from './data/model/user';

const app = express();
connectDB().then(() => console.log('connected to db'));

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
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/hypnobuddy' }),
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

//start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;