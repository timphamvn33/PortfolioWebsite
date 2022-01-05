const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const res = require("express/lib/response");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+ "/index.html");
})

app.post("/", function(req, res){
    var name = req.body.fname;
    var email = req.body.email;
    var subject = req.body.subject;
    var message = req.body.message;
    
    // post the new subcriber in the Mailchimp
    const data ={
      members: [
        {
          email_address: email,
          status:  "subscribed",
          name:name
          
          

        }
      ]
    }
  

    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/c4e781aa0e";
    const option ={
      method:"POST",
      auth: "thuong:fafaef6a94a1cd51f6b934dee255e2fd-us5"
    }

    const request = https.request(url, option, function(response){
      if(response.statusCode===200){
        res.sendFile(__dirname + "/contact.html");
      }
      else{
        res.sendFile(__dirname+"/error.html");
      }
      response.on("data", function(data){
        console.log(JSON.parse(data));
      });
    });

    request.write(jsonData);
    request.end();

    // after clicking on the try again button then back to the homepage if the error occurs 

    app.post("/error", function(req, res){
      res.redirect("/");
    })

  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function(){
    console.log("server runs")
})






// api key: fafaef6a94a1cd51f6b934dee255e2fd-us5

// list id: c4e781aa0e