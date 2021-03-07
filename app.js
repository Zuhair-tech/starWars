if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const User = require('./models/user');
const MongoStore = require('connect-mongo').default;

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/starWars';
const secret = process.env.SECRET || 'needsecret';

const store = new MongoStore({
    mongoUrl: dbUrl,
    dbName: 'starWars',
    secret,
    touchAfter : 24*3600
})

const userRoutes = require('./routes/user');
const artRoutes = require('./routes/arts');
const reviewRoutes = require('./routes/reviews');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected")
});

const sessionConfig ={
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000*3600*24*7,
        maxAge: 1000*3600*24*7
    }
};

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(express.static( path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(flash())

app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session()); 

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');    
    next();
})

app.use('/', userRoutes)
app.use('/arts', artRoutes)
app.use('/arts/:id/reviews', reviewRoutes)

app.get('/', (req,res)=>{
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=> {
    res.status(500)
    res.render('error', {err})
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("serving on port")
})