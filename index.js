const express = require("express");
const app = express();
app.use(express.json());
const {query} = require("./api/services/database.service");

app.get('/', async (req, res) => {
    const rows = await query("SHOW TABLES");
    res.json(rows);
})

app.get('/:table', async (req, res) => {
    const { table } = req.params;
    const sql = `SELECT * FROM ${table} WHERE is_deleted = 0`;
    const rows = await query(sql);
    res.json(rows);
})

app.get('/:table/:id', async (req, res) => {
    const { table } = req.params;
    const id = req.params.id;
    const sql = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
    const rows = await query(sql);
    res.json(rows.length == 1 ? rows.pop() : null);
})

app.post('/:table', async (req, res) => {
    const { table } = req.params;
    const { body } = req;
    for(const key in body){
        if(typeof body[key] == "string")
            body[key] = body[key].replace(/'/g, "\\'");
    }
    const keys = Object.keys(body).join(",");
    const values = "'" + Object.values(body).join("','") + "'";
    const sqlInsert = `INSERT INTO ${table} ( ${keys} ) VALUES ( ${values} )`;
    const insertResult = await query(sqlInsert);
    const { insertId } = insertResult;
    const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${insertId}`;
    const rows = await query(sqlSelect);
    res.json(rows.length == 1 ? rows.pop() : null);
})

app.put('/task/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Update the row of task table with id=${id}`);
})

app.patch('/task/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Soft delete the row of task table with id=${id}`);
})

app.delete('/task/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Hard delete the row of task table with id=${id}`);
})


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})