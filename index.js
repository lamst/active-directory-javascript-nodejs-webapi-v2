const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const config = require('./config');
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

// Check for clientId placeholder
if (config.clientID === 'YOUR_CLIENT_ID') {
    console.error("Please update 'options' with the client id (application id) of your application");
    return;
}

const bearerStrategy = new BearerStrategy(config, (token, done) => {
        // Send user info using the second argument
        done(null, {}, token);
    }
);

var todoStore = [];

const router = express.Router();
const app = express();

app.use(morgan('dev'));
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

passport.use(bearerStrategy);

// enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// API endpoint
router.get("/api/todolist", (req, res) => {
    res.status(200).json(JSON.stringify(todoStore));
});

router.post("/api/todolist", (req, res) => {
    if (req.body.owner && req.body.title) {
        console.log(req.body);
        todoStore.push(req.body);
    }
    res.status(200).end();
});

// Add router to the express app
app.use("/", router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Listening on port " + port);
});
