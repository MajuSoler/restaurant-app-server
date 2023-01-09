const { Router } = require("express");
const { Op } = require("sequelize");
const User = require("../models/").user;
const authMiddleware = require("../auth/middleware");

const router = new Router();

//all
router.get("/all", authMiddleware, async (req, res) => {
    if (!req.user.dataValues["isAdmin"]) {
        return res.status(403).send({
            message:
              "You do not have sufficient priviliges to access this content"
          });
    }
    
    const users = await User.findAll({ 
        attributes : ["id","name",'email','accountBlocked']
    });

    return res.status(200).send({"users": users})
  });

//blockUnblock
router.post("/blockUnblock", authMiddleware, async (req, res) => {
    if (!req.user.dataValues["isAdmin"]) {
        return res.status(403).send({
            message:
              "You do not have sufficient priviliges to perform this action"
          });
    }

    const { id, accountBlocked } = req.body;
    if (!id) {
        return res
          .status(400)
          .send({ message: "Please provide an id" });
    }
    if (!isBool(accountBlocked)) {
        return res
          .status(400)
          .send({ message: "Please provide an accountBlocked value of type Boolean" });
    }

    await User.update({accountBlocked: accountBlocked},{
        where: { id: id }
    },)
    
    const blockDescription = "blocked"
    if (!accountBlocked) {
        "unblocked"
    }
    return res.status(200).send({ message: `User was ${blockDescription}` })
});

module.exports = router;