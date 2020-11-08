require("dotenv").config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const moment = require("moment")
const bcrypt = require('bcrypt');
const bearer = require('bearer');

const fs = require("fs")

const port = 80 

const errors = require("./errors.json")

const mongoose = require('mongoose');
mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const users = require("./mongo/users");

const app = express()

app.use(cors())
app.use(bodyParser.json());
app.use((req, res, next) => {res.set("Access-Control-Allow-Origin", "*");res.set("Access-Control-Allow-Methods", "GET, POST");console.log(" [" +req.method +"] " + req.url);next();})

const routes = {};



bearer({
    //Make sure to pass in the app (express) object so we can set routes
    app:app,
    //Please change server key for your own safety!
    serverKey:process.env.serverKey,
    tokenUrl:'/oauth/token', //Call this URL to get your token. Accepts only POST method
    extendTokenUrl:'/oauth/refresh', //Call this URL to get your token. Accepts only POST method
    cookieName:'x-auth', //default name for getting token from cookie when not found in Authorization header
    createToken:async function(req, next, cancel){
        //If your user is not valid just return "underfined" from this method.
        //Your token will be added to req object and you can use it from any method later
        var email = req.body.email;
        var password = req.body.password;
        console.log(req.body)
        if (!password || !email) return cancel({code:1000, message: errors["1000"]});
        let user = await users.findOne({ email:email });
        if(!user) return cancel({code:1000, message: errors["1000"]});
        if (!await bcrypt.compare(password,user.password)) return cancel({code:1000, message: errors["1000"]});

        //You get the idea how to use next and cancel callbacks, right?

        if (true){
            next({
                expire: moment(Date.now()).add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                username: email,
                contentType: req.get('Content-Type'),
                ip: req.ip,
                userAgent: req.header('user-agent'),
                custom_id: user._id,
                another: 'Some data you need in your token',
                moreData: 'Some more data you need'
            });
        }else{
            cancel({code:1000, message: 'I do not like you'});
        }
    },
    extendToken:function(req, next, cancel){
        var token=req.authToken;
        if (token){
            next({
                expire: moment(Date.now()).add('days', 1).format('YYYY-MM-DD HH:mm:ss'),
                username: token.username,
                contentType: req.get('Content-Type'),
                ip: req.ip,
                userAgent: req.header('user-agent'),
                custom_id: '55555',
                another: 'Some data you need in your token',
                moreData: 'Some more data you need'
            });
        }else{
            cancel();
        }
    },
    validateToken:function(req, token){
        //you could also check if request came from same IP using req.ip==token.ip for example
        if (token){
            return moment(token.expire)>moment(new Date());
        }
        return false;
    },
    onTokenValid:function(token, next, cancel){
        //This is in case you would like to check user account status in DB each time he attempts to do something.
        //Doing this will affect your performance but its your choice if you really need it
        //Returning false from this method will reject user even if his token is OK
        var username=token.username;
        if (true){
            next()
        }else{
            cancel();
        }
    },
    userInRole:function(token, roles, next, cancel){
        //Provide role level access restrictions on url
        //You can use onTokenValid for this also, but I find this easier to read later
        //If you specified "roles" property for any secureRoute below, you must implement this method
        var username=token.username;
        if (true){
            next();
        }else
        {
            cancel();
        }
    },
    onAuthorized: function(req, token, res){
        //console.log("this will be executed if request is OK");
        app.use((req, res, next) => {req.token=token;next();})
        app.get('/checkAuth', (req, res) => (res.send(true)))
        app.use("/admin", require("./routes/admin"))
        

    },
    onUnauthorized: function(req, token, res, errorMessage){
        //console.log(req.path, "this will be executed if request fails authentication");
        res.status(401).send({code:1002, message: errors["1002"]});
    },
    secureRoutes:[
        {url:'/dashboard', method:'post'},
        {url:'/checkAuth', method:'get'},
        {url:'/server/*', method:'post'},
        {url:'/admin', method:'post', roles:["admin"]},
        {url:'/admin/*', method:'post', roles:["admin"]}, //any action under /secure route but NOT default "/secure" route
        {url:'/admin/*', method:'get', roles:["admin"]} //any action under /secure route but NOT default "/secure" route
    ]
});

    // //pull all routes from routes
    // fs.readdir("./routes", (err, files) => {
    //     files.forEach(file => {
    //         routes[file.replace(".js","")] = require("./routes/"+file);
    //     });

    //     //register route
    //     app.use('/register', routes.register);

        
    // });
    app.use('/register', require("./routes/register"))

//  app.all("/*", (req, res) =>  {res.status(404).send({code:1003, message: errors["1003"]})});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


