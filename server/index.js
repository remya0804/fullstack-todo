require("dotenv").config();

const {connectToMongoDB} = require('./database');

const express = require('express');

const app = express();

app.use(express.json());

const path = require('path');

app.use(express.static(path.join(__dirname,"build")));
app.get("/",(req,res) => {

    res.sendFile(path.join(__dirname,"build/index.html"));
})

const PORT = process.env.PORT || 5000;

const router = require('./routes');

app.use("/api",router);

const startServer = async () => {

    await connectToMongoDB();

    app.listen(PORT, () =>{

        console.log(`Server is running on port:  ${PORT} ` );
    });
}

startServer();
