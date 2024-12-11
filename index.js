var express = require("express")
var bodyparser = require("body-parser")
var mongoose = require("mongoose")
const app = express()

app.use(bodyparser.json())
app.use(express.static("public"))
app.use(bodyparser.urlencoded({
    extended: true }))

mongoose.connect('mongodb://localhost:27017/wmart');

var db = mongoose.connection;

db.once("open",()=>console.log("Connected to Database"))

app.post("/login",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var phonenumber = req.body.phonenumber;
    var password = req.body.password;


    var data = {
        "name": name,
        "email":email,
        "phonenumber":phonenumber,
        "password":password,
        "points":5
    }

    db.collection("users").insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record inserted successfully");
    });

    return res.redirect("index.html")
})





const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model('users', userSchema);


app.post("/verify", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email, password });
      if (user) {
        console.log("User found");
        res.redirect(`/userpage?user=${JSON.stringify(user)}`);
      } else {
        res.redirect('/login.html');
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });


  app.post("/quizpoints", async (req, res) => {
    fetch('/verify')
    .then(res.redirect(`/userpage?user=${JSON.stringify(user)}`)
    )
  });





  //products loading 

  const productSchema = new mongoose.Schema({
    product_name: String,
    product_points: String,
    product_image:String,
});


  const Product = mongoose.model('products', productSchema);

app.get("/products", async (req, res) => {
  try {
    console.log("Bringing the products from the database");
    const pros = await Product.find();
    res.send(pros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/search", async (req, res) => {
  const { search_val } = req.body;
  try {
    console.log("Searching required products from the database");
    const pros = await Product.find();
    res.send(pros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


const quizSchema = new mongoose.Schema({
  question: String,
  a: String,
  b: String,
  c: String,
  d: String,
  answer:String,
});





app.post("/view", async (req, res) => {
  const productImage = req.query.data;
  res.redirect(`/details?user=${JSON.stringify(productImage)}`)
});



  
  app.get('/userpage', (req, res) => {
    const userData = req.query.user;
    if (userData) {
      const user = JSON.parse(userData);
      res.sendFile(__dirname + '/public/userpage.html');
    } else {
      res.status(400).send('User data not found');
    }
  });

  



//redirecting to the web page

app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":'*'
    })

    return res.redirect("login.html");
}).listen(3000);

console.log("Listening on port 3000");








   