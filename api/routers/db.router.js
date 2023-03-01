const express = require("express");
const dbRouter = express.Router();
const dbService = require("../services/database.service");

dbRouter.all("*", async (req, res, next) => {
  const table = req.params[0].replace(/^\/+/, '').replace(/\/+$/, '').split('/')[0];
  if(global.tables.includes(table)){
    next();
  }
  else{
     res.status(400).json({ data: null, result: false, message: "Bad request" })
  }
})

dbRouter.get("/:table", async (req, res) => {
    const { table } = req.params;
    const dbResp = await dbService.selectAll(table);
    res.status(dbResp?.result ? 200 : 400).json(dbResp);
  });
  
  dbRouter.get("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const dbResp = await dbService.selectOne(table, id);
    res.status(dbResp?.result ? 200 : 400).json(dbResp);
  });
  
  dbRouter.post("/:table", async (req, res) => {
    const { table } = req.params;
    const { body } = req;
    const dbResp = await dbService.createOne(table, body);
    res.status(dbResp?.result ? 200 : 400).json(dbResp);
  });
  
  dbRouter.put("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const { body } = req;
    const dbResp = await dbService.updateOne(table, id, body);
    res.status(dbResp?.result ? 200 : 400).json(dbResp);
  });
  
  dbRouter.patch("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const dbResp = await dbService.softDeleteOne(table, id);
    res.status(dbResp?.result ? 200 : 400).json(dbResp);
  });
  
  dbRouter.delete("/:table/:id", async (req, res) => {
    const { table, id } = req.params;
    const dbResp = await dbService.hardDeleteOne(table, id);
    res.status(dbResp?.result ? 200 : 400).json(dbResp);
  });

module.exports = dbRouter;