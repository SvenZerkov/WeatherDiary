const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateId } = require('../middleware/validators');
const { deleteNote, updateNote } = require('../controllers/notes');


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
], noteController.deleteNote);

// update note
router.patch('api/notes/:id', [
    check('temperature').trim().notEmpty().isNumeric().withMessage('Temperature should be number'),
    check('comment').trim().notEmpty().withMessage('Comment is required'),
    check('id').trim().custom(validateId)
], noteController.updateNote);

module.exports = router;