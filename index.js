
const express = require("express") 
const path = require('path') 
const app = express() 
const { Client } = require('pg');
   
var PORT = process.env.PORT || 3000 
  
// View Engine Setup 
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}))
app.use(express.json())
  
app.get("/", function(req, res){ 
    res.sendFile('./public/index.html', { root: __dirname }); 
}) 

app.post('/createCase', (req, res) => {
    console.log("Request::",req.body);

    const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
    });

    client.connect();

    client.query('INSERT INTO sfg.case (ContactEmail, Subject, Description, Status, Origin) VALUES ($1, $2, $3, $4, $5)', 
        [req.body.email, req.body.subject, req.body.description, 'New', 'Web'], 
        (err, data) => {
            if (err) {
                res.status(400).json({error: err.message});
                console.log(err);
            }
            else {
                res.send('Case created!');
            }
        }
    );
})
   
app.listen(PORT, function(error){ 
    if(error) throw error 
    console.log("Server created Successfully on PORT", PORT) 
}) 