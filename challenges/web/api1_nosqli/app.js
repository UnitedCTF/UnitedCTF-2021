// Inspired by: https://github.com/73696e65/ctf-notes/blob/master/2016-IceCTF/ChainedIn-Web-75.txt
// IceCTF GitHub: https://github.com/IceCTF

const express = require('express');
const mongo = require('mongodb');
const app = express();
const morgan = require('morgan');
const swagger = require('swagger-ui-express');
const swaggerJsDocs = require('swagger-jsdoc')
const cors = require('cors');
const quotes = require('inspirational-quotes');
const e = require('express');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Quotes-A-Day", // short title.
            description: "Quotes for everyone (that has an account), everyday!", //  desc.
            version: "1.0.0", // version number
            contact: {
                name: "Admin", // your name
                email: "admin@unite.com", // your email
                url: "https://unitedctf.ca", // your website
            }
        }
    },
    apis: [
        "./app.js",
    ]
}

const specs = swaggerJsDocs(options);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cors());
app.use('/docs', swagger.serve, swagger.setup(specs))


mongo.MongoClient.connect(process.env.MONGO_URL)
    .then(async (client) => {
        const db = client.db(process.env.MONGO_INITDB_DATABASE);
        try {
            await db.dropCollection('users')
        } catch (e) {}
        await db.createCollection('users')
        await db.collection('users').insertMany(
            [
                {"email": "demo@unite.com", "password": "demo"},
                {"email": "admin@unite.com", "password": process.env.FLAG}
            ]
        );

        app.get("/", (req, res) => res.redirect("/docs"));

        /**
         * @swagger
         * components:
         *   schemas:
         *     Quotes:
         *          type: object
         *          properties:
         *              quote:
         *                  type: string
         *                  description: The generated quote
         *          example:
         *              quote: A successful man is one who can lay a firm foundation with the bricks others have thrown at him.
         *     User:
         *          type: object
         *          properties:
         *              email:
         *                  type: string
         *                  description: The registered user email
         *              password:
         *                  type: string
         *                  description: The registered user's password
         *          example:
         *              email: demo@unite.com
         *              password: demo
         *     APIKeyResponse:
         *          type: object
         *          properties:
         *              API_KEY:
         *                  type: string
         *                  description: API Key of the user
         *              message:
         *                  type: string
         *                  description: Status message
         *          example:
         *              API_KEY: 2261256b5488b6c2f2590935
         *              password: Use API_KEY as the value to the api_key parameter in our other queries
         *     FailedResponse:
         *          type: object
         *          properties:
         *              message:
         *                  type: string
         *                  description: Status message
         *          example:
         *              message: Invalid body/credentials.
         */

        /**
         * @swagger
         * tags:
         *   name: Quotes
         *   description: Quote Generator API
         */

        /**
         * @swagger
         * /quotes:
         *   get:
         *     summary: Returns a quote from our huge Mongo database!
         *     tags: [Quotes]
         *     parameters:
         *     -    in: query
         *          name: API_KEY
         *          schema:
         *              type: string
         *          required: true
         *          description: Your registered API Key provided through a post request to our /api_key endpoint
         *     responses:
         *       200:
         *         description: A randomly selected and generated quote
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Quotes'
         *       403:
         *         description: Invalid or missing API Key
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/FailedResponse'
         */

        app.get('/quotes', async (req, res) => {
            let valid = true;
            const api_key = req.query.API_KEY || req.query.api_key

            if (!api_key || api_key.length !== 24) {
                valid = false;
            }

            let id;
            try {
                id = new mongo.ObjectId(req.query.API_KEY);
            } catch (e) {
                valid = false;
                console.log(e);
            }

            if (!valid) {
                return res.status(403).send({message: "Invalid or missing API Key"});
            }

            const user = await db.collection('users').findOne({'_id': id});
            if (!user) {
                return res.status(403).send({message: "Valid API Key format, but the user could not be found"});
            }

            res.status(200).send({"quote": quotes.getRandomQuote()});
        });

        /**
         * @swagger
         * /api_key:
         *   post:
         *     summary: Get your api_key. You must have an account with us, if not, speak with our administrator!
         *     tags: [API_KEY]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *              $ref: '#/components/schemas/User'
         *           example:
         *              email: demo@unite.com
         *              password: demo
         *     responses:
         *       200:
         *         description: The key was successfully created
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/APIKeyResponse'
         *       400:
         *         description: Invalid body
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/FailedResponse'
         *       403:
         *          description: Invalid credentials
         *          content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/FailedResponse'
         */

        app.post('/api_key', async (req, res) => {
            await new Promise(r => setTimeout(r, 200));
            if (!req.body.email || !req.body.password) {
                return res.status(400).send({"message": "Invalid body"});
            }

            db.collection('users').findOne({
                email: req.body.email,
                password: req.body.password
            }).then((user) => {
                if (!user) {
                    return res.status(404).send({
                        "message": "Invalid credentials."
                    });
                }
                return res.status(200).send({
                    "API_KEY": user._id.toString(),
                    "message": "Use API_KEY as the value to the api_key parameter in our other queries"
                });
            }).catch(e => console.log(e));
        })

        /**
         * @swagger
         * /systemInfo:
         *   get:
         *     summary: Get the current health of our servers. This feature will be available next update!
         *     tags: [System Health]
         *     responses:
         *       200:
         *         description: Coming in the next update!
         */
        app.get("/systemInfo", (req, res) => {
            return res.status(200).send({"message": "Feature coming in the next update!"})
        })

        const port = process.env.PORT || 3000;
        app.listen(port);
        console.log("Server listening on port " + port);
    });

