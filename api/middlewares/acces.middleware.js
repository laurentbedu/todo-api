const express = require("express");
const accesMiddleware = express.Router();
const config = require("../config");
const jwt = require("jsonwebtoken");

accesMiddleware.all("*", async (req, res, next) => {
  const authorization = req?.headers?.authorization;
  try {
    if (!authorization) {
      throw new Error("Bad Api Key");
    }
    const result = jwt.verify(authorization, config.authorization.secret);
    if (!result || !config.authorization.keys.includes(result)) {
      throw new Error("Bad Api Key");
    }
    next();
  } catch {
    res.status(401)
      .send({ data: null, result: false, message: `Bad Api Key` });
  }
});

module.exports = accesMiddleware;
