const express = require('express');
require('dotenv').config();
const env= require('./config/environment.js');


const cookieParser=require('cookie-parser');
console.log(process.env);

const app = express();

const path = require('path');




const port= process.env.PORT || 8000;
const db=require('./config/mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const flash=require('connect-flash');
const customMware = require('./config/middleware');
const favicon = require('serve-favicon');
app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );




const MongoStore=require('connect-mongo')(session);
const expressLayouts=require('express-ejs-layouts');
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }))
app.use(expressLayouts);


app.use(express.static(__dirname+'/public'));
app.use('/uploads',express.static(__dirname+'/uploads'));

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.set("view engine", "ejs");
app.set('views','./views');



// mongo store is used to store the session in the db
const sessionMiddleware=session({
    name:'blog',
    secret: env.session_cookie_key,
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection:db,
        autoRemove: 'disabled'
      },
    function(err)
    { 
        console.log(err || "connect-mongo setup ok");
    }
    )

});

app.use(sessionMiddleware);


const server = require( 'http' ).Server( app );






const botName = 'Chat Room';






app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

app.use('/',require('./routes'));


server.listen(port,function(err){
    if(err){
        console.log(`error is:$(err)`);
    }
    else{
    console.log(`Server is running on port ${port}`);
    }
});