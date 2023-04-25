const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();
const path = require("path");

const app = express();

// Dummy "database"
let products = [   
    { id: 1, name: 'Chair', price: 100 },   
    { id: 2, name: 'Table', price: 200 }   
];


app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, "views/partials")
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use("", require("./routes/notes.js"));


app.get('/', (req, res) => {
    res.render('index',
    {
        pagetitle: "WeatherDiary",
        desc: "Welcome to the weather diary!",
        products : products
    });
})

/* app.delete("/api/notes/:id", (req,res) {
    const id = req.params.id;

    const noteIndex = notes.findIndex( =>)
}) */



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening port ${PORT}`));
