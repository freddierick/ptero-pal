var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer');
const { nanoid } = require('nanoid')
const bcryptt = require('bcrypt');

const users = require("../mongo/users");


const sendMail = async function(data, to){
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'freddiePostBox',
        pass: '8UB4xPpyubQq'
    }
    });
    var mailOptions = {
    from: 'freddiePostBox@gmail.com',
    to,
    subject: 'Your Conformation Code',
    text: data
    };

    await transporter.sendMail(mailOptions)//, function(error, info){
    // if (error) {
    //     console.log(error);
    // } else {
    //     console.log('Email sent: ' + info.response);
    // }
    // });
    return;
}

let cache = {};

router.post('/getToken', async function (req, res) {
  const token = nanoid(50);
  res.send({error:false,token})
})

router.post('/email', async function (req, res) {
    console.log(req.body)
    if (!req.body.email || !req.body.token) return;
    user = await users.findOne({email: req.body.email});
    console.log(user)
    if (user) return res.send({error:true,message:"There is all ready an account with that email!"})
    console.log("New User")
    const id = nanoid(5);
    cache[req.body.token] = {
        email: req.body.email,
        code: id
    };
    console.log(cache[req.body.token])
    try {
        await sendMail(`Your code is ${id}`, req.body.email)
    } catch (error) {
        return res.send({error:true,message:"I couldn't send that email"})
    }
    res.send({error:false})
})


router.post('/code', async function (req, res) {
    console.log(req.body)
    if (!req.body.code || !req.body.token) return;
    console.log(cache[req.body.token])
    if(cache[req.body.token].code != req.body.code) return res.send({error:true,message:"That code was wrong!"});
    cache[req.body.token].codeRight = true;
    res.send({error:false})
})
router.post('/password', async function (req, res) {
  console.log(req.body)
  const {passConf, pass} = req.body
  if (!passConf ||!pass || !req.body.token) return;
  console.log(cache[req.body.token])
  if(passConf != pass) return res.send({error:true,message:"Those passwords don't match!"});
  let hashedPass = await bcryptt.hash(passConf,10);
  if (!cache[req.body.token].codeRight) return;
  await users.create({
    email:cache[req.body.token].email,
    password: hashedPass,
    created: Date.now()
  });
  res.send({error:false})
})

module.exports = router;