// Import dotenv module
require("dotenv").config()

// Create auth credentials for SignalWire - this is your Project ID and Auth Token
const auth = {
    username: process.env.SWusername,
    password: process.env.SWpassword
}

// Set Space URL for our requests. Requests are always <your SW space>.signalwire.com/ <endpoint>
// For example, demo.signalwire.com/api/video/room_tokens
const apiurl = process.env.url;

// Basic express boilerplate
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const { application } = require("express");

const app = express();
app.use(bodyParser.json());
app.use(cors());
// I use EJS here, but you could just as easily rever this back to html
app.set('view engine', 'ejs')
app.use('/views', express.static('views'));


// Endpoint to request token for the conference
app.post("/get_token", async (req, res) => {
    let { user_name } = req.body;
    try {
        let token = await axios.post(
            // sets parameters for the conference token.
            // you could also set join_fron, join_until, ect.
            // full documentation on this is https://developer.signalwire.com/rest/generate-a-new-video-room-token
            apiurl + "/room_tokens",
            {
                user_name: user_name,
                room_name: 'auctions',
                join_audio_muted: true,
                join_video_muted: true,

            },

            { auth }
        );
        // returns the token to the client
        return res.json({ token: token.data.token });
    } catch (e) {
        console.log(e);
        return res.sendStatus(500);
    }
});

// Guest/Default endpoint with controls disabled
app.get('/', async (req, res) => {
    res.render('guest')
})

// Broadcaster endpoint with controls visible
app.get('/broadcaster', async (req, res) => {
    res.render('index')
})

// Start the server
async function start(port) {
    app.listen(port, () => {
        console.log("Server is on port", port)
    })
};

start(8080);