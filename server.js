require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const app = express();
app.use(express.json())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './tmp/'
}));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

//routes
const student = require('./routes/students.routes.js')


const PORT = process.env.PORT || 3002;

app.listen(PORT, async () => {
    console.log(`server running at ${PORT}`)
})


app.use('/students', student);

