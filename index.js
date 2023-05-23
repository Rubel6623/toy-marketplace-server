const express = require('express');
const cors = require('cors');
const app=express();
const port= process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Marketplace is running')
})

app.listen(port, ()=>{
    console.log(`Toy marketplace Server is running on port : ${port}`)
})
