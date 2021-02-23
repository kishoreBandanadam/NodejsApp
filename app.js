
const express = require("express") 
const path = require('path') 
const app = express() 
const { Client } = require('pg');
   
var PORT = process.env.PORT || 3000 
  
// View Engine Setup 
app.set("view engine", "ejs") 
app.use(express.urlencoded({extended:false}))
app.use(express.json())
  
app.get("/", function(req, res){ 
      
    //Sample date to be filled in form 
    var caseRec = { 
        email: 'test@gmail.com', 
        subject: 'New Case', 
        description: 'ABC Colony, House 23, India'
    } 
  
    res.render("form", {
        "caseRec" : caseRec
    }); 
}) 

app.post('/createCase', (req, res) => {
    console.log("Request::",req.body);

    const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
    });

    client.connect();

    client.query('INSERT INTO sfg.case (ContactEmail, Subject, Description) VALUES ($1, $2, $3)', 
        [req.body.email.trim(), req.body.subject.trim(), req.body.description.trim()], 
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