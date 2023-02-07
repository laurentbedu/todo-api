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
    await query(sql)
    .then(data => {
        res.json({data, result: true, message: `all rows of table ${table} have been selected`});
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
})

app.get('/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const sql = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
    await query(sql)
    .then((data) => {
        data = data.length == 1 ? data.pop() : null;
        const result = data != null;
        const message = (result ? `the` : `no`) + ` row of table ${table} with id=${id} has been selected`
        res.json({data, result, message});
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
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
    const insertResult = await query(sqlInsert)
    .then()
    .catch();
    
    //TODO Refactor
    
    const { insertId } = insertResult;
    const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${insertId}`;
    const rows = await query(sqlSelect);
    const data = rows.length == 1 ? rows.pop() : null;
    const result = data != null;
    res.json({data, result, message: `the row of ${table} with id=${id} has been inserted`});
})

app.put('/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const { body } = req;
    for(const key in body){
        if(typeof body[key] == "string")
            body[key] = body[key].replace(/'/g, "\\'");
    }
    const entries = Object.entries(body);
    const values = entries.map(entry => {
        const [key, value] = entry;
        return `${key}='${value}'`;
    }).join(',')
    //TODO Refactor
    const sqlUpdate = `UPDATE ${table} SET ${values} WHERE id = ${id}`;
    const updateResult = await query(sqlUpdate);
    const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
    const rows = await query(sqlSelect);
    const data = rows.length == 1 ? rows.pop() : null;
    const result = data != null;
    res.json({data, result, message: `the row of ${table} with id=${id} has been updated`});
})

app.patch('/:table/:id', async (req, res) => { //TODO Refactor + Test
    const { table, id } = req.params;
    const sqlUpdate = `UPDATE ${table} SET is_deleted = 1 WHERE id = ${id}`;
    const updateResult = await query(sqlUpdate);
    const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 1 AND id = ${id}`;
    const rows = await query(sqlSelect);
    const result = rows.length == 1 ? true : false;
    const data = rows.length == 1 ? rows.pop() : null;
    res.json({data, result, message: `the row of ${table} with id=${id} has been soft deleted`});
})

app.delete('/:table/:id', async (req, res) => { //TODO Test
    const { table, id } = req.params;
    const sqlDelete = `DELETE FROM ${table} WHERE id = ${id}`;
    await query(sqlDelete)
    .then(() => {
        res.json({data: null, result: true, message: `the row of ${table} with id=${id} has been hard deleted`});
    })
    .catch(err => {
        res.json({data: null, result: false, message: err.message});
    });
})


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})