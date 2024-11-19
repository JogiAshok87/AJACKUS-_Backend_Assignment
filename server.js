const express =  require('express')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require("cors")
const UserModel = require('./models/UserModel')
const newUserModel = require('./models/NewUserModel')
dotEnv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(()=>{
    console.log(`MongoDB is Connected Successfully`)
})
.catch((err)=>{
    console.log(`DB connection failed ${err}`)
})


app.post("/register", async(req, res) => {
    try {
      const { FirstName,LastName, email, password, confirmpassword,department } = req.body;
      const exist = await UserModel.findOne({ email });
      if (exist) {
        return res.status(400).send("User Already Registered");
      }
      if (password !== confirmpassword) {
        return res.status(401).send("password and confirmpassword should match");
      }
  
      let newUser = new UserModel({
        FirstName,
        LastName,
        email,
        password,
        confirmpassword,
        department
      });
      await newUser.save();
      console.log('User Registered Successfully')
      
      let payload = {
          user : {id: newUser.id}
      }
  
      jwt.sign(payload, process.env.SECREATE_KEY, {expiresIn:"12hours"}, (err,token)=>{
          if(err) throw err
         
        //  console.log("Generated token",token)
        res.status(200).send({token})
  
      })
  
  
  
    } 
    catch(err){
      return res.status(500).send(`Internal Server Error ${err}`)
    }
  });


  app.post("/login", async(req,res)=>{
    const {email,password} = req.body
    const exist = await UserModel.findOne({email})
    // console.log(name,password)

    if(!exist){
        return res.status(400).send("User does not Exist")
    }

    if(password!==exist.password){
        return res.status(400).send("Invalid password")
    }
    if(exist){
        return res.status(200).send("User successfully logined")
    }

    let payload={
        user:{
            id: exist.id
        }
    }

    jwt.sign(payload,process.env.SECREATE_KEY,{expiresIn:"12hours"},(err,token)=>{
        if(err) throw err
       
       console.log("Generated token",token)
       res.status(200).send({ token })
})
})

app.post("/addUser",async(req,res)=>{
  try{
    const {FirstName,LastName,Email,Department} = req.body;
    const exist = await newUserModel.findOne({Email})
    if(exist){
      return res.status(400).send("User Already exist");
    }
    let newUser = new newUserModel({
      FirstName,
      LastName,
      Email,
      Department
    });
    await newUser.save()

    res.status(200).send(newUser)

  }catch(err){
    console.log(err)
    return res.status(500).send('server error')
  }
})

app.delete("/deleteUser/:id",async(req,res)=>{
  try{
    const user = await newUserModel.findByIdAndDelete(req.params.id)
  res.status(200).send({message:"Uer deleted successfully"})
  }catch(err){
    res.status(500).send({error:"Failed to delete user"})
  }
})

app.put("/updateUser/:id",async(req,res)=>{
  try{
    const user = await newUserModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
  if(user){
    res.send(user)
  }else{
    res.status(404).send({message:"User Not Found"})
  }
  }catch(err){
    console.log(err)
    res.status(500).send({message:"Internal Server Error"})
  }
})

app.get("/users",async(req,res)=>{
  try{
    let allUsers = await newUserModel.find()

    return  await res.json(allUsers)

  }catch(err){
    return res.status(500).send(`Internal server error`)

  }
})





  

const port = process.env.PORT || 5000
app.listen(port,(req,res)=>{
    console.log(`server is started successfully and running at ${port}`)
})



