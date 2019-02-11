const http = require("http");
const url = require("url");

const knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "anikDsi2676",
    database: "demo"
  }
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (path == "/") {
    res.end("Welcome.\n");
  } else if (path == "/about") {
    res.end("This is a simple http server.\n");
  } else if (path == "/api/students") {
    if (req.method == "GET") {
      knex("students")
        .where("student_id", query.id)
        .asCallback((err, rows) => {
          if (err) {
            console.log(err);
          } else {
            res.end(JSON.stringify({ result: rows }));
          }
        });
    } else if (req.method == "POST") {
      let newStudent = {
        student_name: query.name,
        student_grade: query.grade,
        student_age: query.age
      };
      knex("students")
        .insert(newStudent)
        .asCallback((err, rows) => {
          if (err) {
            console.log(err);
          } else {
            res.end(JSON.stringify({ result: rows }));
          }
        });
    } else if (req.method == "PUT") {
      knex("students")
        .where("student_id", query.id)
        .asCallback((err, rows) => {
          if (err) {
            console.log(err);
          } else {
            let updatedStudent = {
              student_name: query.name ? query.name : rows[0].student_name,
              student_grade: query.grade ? query.grade : rows[0].student_grade,
              student_age: query.age ? query.age : rows[0].student_age
            };

            knex("students")
              .where("student_id", query.id)
              .update(updatedStudent)
              .asCallback((err, rows) => {
                if (err) {
                  console.log(err);
                } else {
                  res.end(JSON.stringify({ result: rows }));
                }
              });
          }
        });
    } else {
      knex("students")
        .where("student_id", query.id)
        .del()
        .asCallback((err, rows) => {
          if (err) {
            console.log(err);
          } else {
            if (rows == 0) {
              res.end(
                JSON.stringify({
                  success: false,
                  result: rows,
                  message: "Data doesn't exist"
                })
              );
            } else {
              res.end(
                JSON.stringify({
                  success: true,
                  result: rows,
                  message: "Deleted the item"
                })
              );
            }
          }
        });
    }
  } else {
    res.end("Not sure about what you want.\n");
  }
});

server.listen(3000);
