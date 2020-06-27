// LIBRARY IMPORTS
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

// MIDDLEWARE
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// ROUTES
const accountRouter = require('./routes/account');

app.use('v1/', accountRouter);

// MONGO ATLASDB CONNECTION
const uri = process.env.MONGO_DB_ATLAS;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MONGODB CONNECTION ESTABLISHED SUCCESSFULLY ON");
});

// LOAD EXPRESS SERVER
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`APP IS LISTENING ON PORT ${port}`)
});