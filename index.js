const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));

app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { query } = require("./api/services/database.service");
const bcrypt = require("bcrypt");
const config = require("./api/config");
const jwt = require("jsonwebtoken");

const accesMiddleware = require('./api/middlewares/acces.middleware')
app.use(accesMiddleware);

const authRouter = require('./api/routers/auth.router');
app.use(authRouter);
// app.get("/auth", async (req, res) => {
//   const authCookie = req?.cookies?.auth;
//   try {
//     if (!authCookie) {
//       throw new Error("Bad Auth");
//     }
//     const data = jwt.verify(authCookie, config.token.secret);
//     if (!data) {
//       throw new Error("Bad Auth");
//     }
//     res.json({ data, result: true, message: `Auth OK` });
//   } catch {
//     res.json({ data: null, result: false, message: `Bad Auth` });
//   }
// });

// app.post("/login", async (req, res) => {
//   const { body } = req;
//   const sql = `SELECT * FROM customer 
//                 WHERE is_deleted = 0 
//                 AND email = '${body.email}'`;
//   await query(sql)
//     .then(async (json) => {
//       const user = json.length === 1 ? json.pop() : null;
//       if (user) {
//         const pincodesMatch = await bcrypt.compare(
//           body.pincode,
//           config.hash.prefix + user.pincode
//         );
//         if (!pincodesMatch) {
//           throw new Error("Bad Login");
//         }
//         const { id, email } = user;
//         const data = { id, email };
//         const token = jwt.sign(data, config.token.secret);
//         res.json({ data, result: true, message: `Login OK`, token });
//       } else {
//         throw new Error("Bad Login");
//       }
//     })
//     .catch((err) => {
//       res.json({ data: null, result: false, message: err.message });
//     });
// });

const dbRouter = require('./api/routers/db.router');
app.use(dbRouter);

app.get("/:table", async (req, res) => {
  const { table } = req.params;
  const sql = `SELECT * FROM ${table} WHERE is_deleted = 0`;
  await query(sql)
    .then((data) => {
      res.json({
        data,
        result: true,
        message: `all rows of table ${table} have been selected`,
      });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

app.get("/:table/:id", async (req, res) => {
  //TODO Tests
  const { table, id } = req.params;
  const sql = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
  await query(sql)
    .then((data) => {
      data = data.length == 1 ? data.pop() : null;
      const result = data != null;
      const message =
        (result ? `the` : `NO`) +
        ` row of table ${table} with id=${id} has been selected`;
      res.json({ data, result, message });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

app.post("/:table", async (req, res) => {
  //TODO Tests
  const { table } = req.params;
  const { body } = req;
  for (const key in body) {
    if (typeof body[key] == "string")
      body[key] = body[key].replace(/'/g, "\\'");
  }
  const keys = Object.keys(body).join(",");
  const values = "'" + Object.values(body).join("','") + "'";
  const sqlInsert = `INSERT INTO ${table} ( ${keys} ) VALUES ( ${values} )`;
  await query(sqlInsert)
    .then((insertResult) => {
      const { insertId } = insertResult;
      const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${insertId}`;
      query(sqlSelect)
        .then((data) => {
          data = data.length == 1 ? data.pop() : null;
          const result = data != null && insertResult.affectedRows == 1;
          const message =
            (result ? `a` : `NO`) +
            ` row with id=${insertId} has been inserted in table ${table}`;
          res.json({ data, result, message });
        })
        .catch((err) => {
          res.json({ data: null, result: false, message: err.message });
        });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

app.put("/:table/:id", async (req, res) => {
  //TODO Tests
  const { table, id } = req.params;
  const { body } = req;
  for (const key in body) {
    if (key == "is_deleted") delete body[key];

    if (typeof body[key] == "string")
      body[key] = body[key].replace(/'/g, "\\'");
  }
  const entries = Object.entries(body);
  const values = entries
    .map((entry) => {
      const [key, value] = entry;
      return `${key}='${value}'`;
    })
    .join(",");
  const sqlUpdate = `UPDATE ${table} SET ${values} WHERE is_deleted = 0 AND id = ${id}`;
  await query(sqlUpdate)
    .then((updateResult) => {
      const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 0 AND id = ${id}`;
      query(sqlSelect)
        .then((data) => {
          data = data.length == 1 ? data.pop() : null;
          const result = data != null && updateResult.affectedRows == 1;
          const message =
            (result ? `the` : `NO`) +
            ` row of table ${table} with id=${id} has been updated`;
          res.json({ data, result, message });
        })
        .catch((err) => {
          res.json({ data: null, result: false, message: err.message });
        });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

app.patch("/:table/:id", async (req, res) => {
  //TODO Tests
  const { table, id } = req.params;
  const sqlUpdate = `UPDATE ${table} SET is_deleted = 1 WHERE is_deleted = 0 AND id = ${id}`;
  await query(sqlUpdate)
    .then((updateResult) => {
      const sqlSelect = `SELECT * FROM ${table} WHERE is_deleted = 1 AND id = ${id}`;
      query(sqlSelect)
        .then((data) => {
          data = data.length == 1 ? data.pop() : null;
          const result = data != null && updateResult.affectedRows == 1;
          const message =
            (result ? `the` : `NO`) +
            ` row of table ${table} with id=${id} has been softly deleted`;
          res.json({ data, result, message });
        })
        .catch((err) => {
          res.json({ data: null, result: false, message: err.message });
        });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

app.delete("/:table/:id", async (req, res) => {
  //TODO Tests
  const { table, id } = req.params;
  const sqlDelete = `DELETE FROM ${table} WHERE id = ${id}`;
  await query(sqlDelete)
    .then((deleteResult) => {
      const sqlSelect = `SELECT * FROM ${table} WHERE id = ${id}`;
      query(sqlSelect)
        .then((data) => {
          const result = data.length == 0 && deleteResult.affectedRows == 1;
          const message =
            (result ? `the` : `NO`) +
            ` row of table ${table} with id=${id} has been hardly deleted`;
          res.json({ data, result, message });
        })
        .catch((err) => {
          res.json({ data: null, result: false, message: err.message });
        });
    })
    .catch((err) => {
      res.json({ data: null, result: false, message: err.message });
    });
});

app.get("/", async (req, res) => {
  //TODO https://stackoverflow.com/questions/11477121/mysql-return-updated-rows
  // https://www.fullstacktutorials.com/mysql-stored-procedure-example-with-parameter-37.html
  // https://www.mysqltutorial.org/mysql-nodejs/call-stored-procedures/
  console.log(tables);
  // const rows = await query("SHOW TABLES");
  // let sqlUpdate = `START TRANSACTION; ` +
  // `UPDATE todo SET title = 'modifié' WHERE is_deleted = 0 AND id = 8; ` +
  // `SELECT * FROM todo WHERE is_deleted = 0 AND id = 8; ` +
  // `COMMIT;`
  // await query(sqlUpdate)
  // .then(updateResult => {
  //     console.log(updateResult);
  // }).catch(err => {
  //     console.log(err);
  // });
  // res.json(rows);
  res.json("OK");
});

let tables;
//IIFE
(async () => {
  tables = await query("SHOW TABLES");
  tables = tables.map((row) => row.Tables_in_todo_db);
})();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
