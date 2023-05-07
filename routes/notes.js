const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const dbURI = process.env.dbURI;
const client = new MongoClient(dbURI, { useNewUrlParser: true });


const noteController = require("../controllers/notes.js");

/* 
router.get("/", noteController.home); 
router.post("/", noteController.newHome);
router.get("/api/notes/(:id)", noteController.getNote);
router.get("/api/notes", noteController.getAll);
*/

module.exports = router;