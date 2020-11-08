var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer');
const { nanoid } = require('nanoid')
const bcryptt = require('bcrypt');

const users = require("../mongo/users");


router.post('/setup', async function (req, res) {
    let token  = req.token;
    const { panURL, panKEY, diskID, discSec } = req.body;
    console.log(panURL, panKEY, diskID, discSec);

    console.log(token)
  })

router.get('/setup/redirectURL', async function (req, res) {
    let token  = req.token;
    console.log(token)
    res.send({id: token.custom_id})
  })


  router.get('/dashboard', async function (req, res) {
    let token  = req.token;
    console.log(token)
    const userData = await users.findOne({ _id: token.custom_id });

    const toSend = {
      requiresSetup: false,
      email: userData.email
    } 
    if (!userData.panelCreds && !userData.discordCreds) toSend.requiresSetup = true;
    return res.send(toSend)

  })

module.exports = router;
