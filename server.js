const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } // allow all origins for testing
});

io.on("connection", (socket) => {
    console.log("user connected : " + socket.id);

    socket.on("shutdown", (data) => {
        if (data === true) {
            console.log("Shutting down gracefully...");
            process.exit(0);
        }
    });

});




const port = process.env.PORT;



// Enable CORS for all routes

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*');

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();

});



// Serve static files

app.use(express.static('.'));

app.use('/uploads', express.static('uploads'));



// MySQL Connection Pool
let db;
try {
    db = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USRNAME, //your mariadb user
        password: process.env.DB_PASSWORD, //your mariadb password
        database: process.env.DB, //your mariadb database
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true
    });
    console.log('MySQL connection pool created');
} catch (error) {
    console.warn('MySQL connection failed:', error.message);
    console.warn('File uploads will work, but database logging will be disabled');
}



// Multer storage configuration

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, 'uploads/'); // Directory to save uploaded files

    },

    filename: (req, file, cb) => {

        // Simple filename: keep original name or use simple counter
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}${ext}`); // Keep original filename
    }

});



const upload = multer({ storage: storage });



// File upload endpoint
app.post('/upload', upload.single('uploadedFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;
    const originalname = req.file.originalname;
    const mimetype = req.file.mimetype;
    const size = req.file.size;

    console.log(`File uploaded: ${originalname} (${size} bytes)`);

    // Try to save to database if available
    if (db) {
        const sql = 'INSERT INTO files (filePath, originalname, mimetype, size) VALUES (?, ?, ?, ?)';
        db.query(sql, [filePath, originalname, mimetype, size], (err, result) => {
            if (err) {
                console.error('Error inserting into database:', err);
                // Still return success since file was uploaded
                res.status(200).send('File uploaded successfully (database logging failed).');
            } else {
                res.status(200).send('File uploaded and info saved to database.');
            }
        });
    } else {
        // No database connection, but file was still uploaded
        res.status(200).send('File uploaded successfully.');
    }
});



app.get('/files', (req, res) => {

    const directoryPath = path.join(__dirname, 'uploads'); // Replace with your directory

    fs.readdir(directoryPath, (err, files) => {

        if (err) {

            console.log('Unable to scan dir')

            return res.status(500).send('Unable to scan directory: ' + err);

        }

        res.json(files);

    });

});




server.listen(port, () => {

    console.log('web at http://localhost:3000/fileshare.htm')
    console.log(`Server listening at http://localhost:${port}`);

});