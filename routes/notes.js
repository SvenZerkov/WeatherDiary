const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateId } = require('../middleware/validators');
const { deleteNote } = require('../controllers/notes');

const noteController = require("../controllers/notes.js");

/* const MongoClient = require('mongodb').MongoClient;
const dbURI = process.env.dbURI;
const client = new MongoClient(dbURI, { useNewUrlParser: true }); */

/* 
router.get("/", noteController.home); 
router.post("/", noteController.newHome);
router.get("/api/notes/(:id)", noteController.getNote);
router.get("/api/notes", noteController.getAll);
*/

// get all notes
router.get("/api/notes", noteController.getAll);

// get one note
router.get("/api/notes/(:id)", noteController.getNote);

// delete note by id
router.delete('/api/notes/:id', [
    check('id').custom(validateId),
], deleteNote);

// update note


module.exports = router;