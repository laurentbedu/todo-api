const express = require("express");
const authRouter = express.Router();
const { query } = require("../services/database.service");

//TODO GET/:table, GET/:table:id, POST/:table, 
//PUT/:table:id, PATCH/:table:id, DELETE/:table:id

module.exports = authRouter;