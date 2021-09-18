const express = require('express');
const router = express.Router();
const studentController = require('../controller/student.controller')
const multer = require('multer');
const upload = multer({ dest: '../tmp/' });


router.get('/',studentController.getStudent);

router.get('/:id/result', studentController.getStudentResult);

router.post('/upload',studentController.uploadStudentCSV);

module.exports = router;