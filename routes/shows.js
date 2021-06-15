const express = require('express')
const router = express.Router();

const UserModel = require('../models/user.model')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

const authenticateToken = (req, res, next) =>
{
    if(req.headers && req.headers['authorization'])
    {
        console.log("token found");
        const token = req.headers['authorization'].split(' ')[1];
       
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>
        {
            if(err)
            {
              
                res.status(401).send({"loggedIn" : false, "msg" : "Invalid token"});
                console.log("Invalid token")
                return;
            }

            console.log("token valid");
            req.user = user;
            next();
        }
        )
    }
    else
    {
        //token wasn't sent
        res.status(401).send({"msg" : "token wasn't sent"});
        console.log("No token recieved");
        return;
    }
}

router.post('/showstatus', authenticateToken, async (req, res) =>
{
    console.log("Request for show status at " + new Date());
    console.log(req.body);
    const userData = await UserModel.findOne({"username" : req.user.username});

    let found = false;
    for(var i=0; i<4; i++)
    {
        userData.lists[i].shows.forEach((show) => 
        {
            if(show.showId == req.body.id)
            {
                res.send({"listName" : userData.lists[i].listName, "msg" : "found"});
                found = true;
            }
        })
    }
    if(!found)
    res.send({'listName' : '', 'msg' : 'not found'});
})

module.exports = router