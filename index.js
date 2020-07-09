const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const config = require('./config');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express')
const BearerStrategy = require('passport-azure-ad').BearerStrategy;

// App Modules
const User = require("./models/Todo");

// Swagger set up
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Time to document that Express API you built",
            version: "1.0.0",
            description:
                "A test project to understand how easy it is to document and Express API",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/"
            },
            contact: {
                name: "Swagger",
                url: "https://swagger.io",
                email: "Info@SmartBear.com"
            }
        },
        servers: [
            {
                url: "http://mcw-dev2:8282/api"
            }
        ]
    },
    apis: ["./models/todo.js", "./index.js"]
};
const specs = swaggerJsdoc(options);

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

/**
 * @swagger
 * path:
 *  /todolist/:
 *    get:
 *      summary: Get all TODO items for a given user
 *      tags: [Todo]
 *      responses:
 *        "200":
 *          description: An array of TODO items
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Todo'
 */
router.get("/todolist", (req, res) => {
    console.log(JSON.stringify(todoStore));
    res.status(200).json(todoStore);
});

/**
 * @swagger
 * path:
 *  /todolist/:
 *    post:
 *      summary: Create a new TODO item
 *      tags: [Todo]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Todo'
 *      responses:
 *        "200":
 *          description: A new TODO item is created
 */
router.post("/todolist", (req, res) => {
    if (req.body.hasOwnProperty('Title')) {
        console.log(req.body);
        if (!req.body.hasOwnProperty('Owner')) {
            req.body.Owner = '';
        }
        todoStore.push(req.body);
    }
    res.status(200).end();
});

router.use("/docs", swaggerUi.serve);
router.get(
    "/docs",
    swaggerUi.setup(specs, {
        explorer: true
    })
);

// Add router to the express app
app.use("/api", router);

const port = process.env.PORT || 8282;
app.listen(port, () => {
    console.log("Listening on port " + port);
});
