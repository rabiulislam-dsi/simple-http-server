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
  //parse the url
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // root
  if (path == "/") {
    res.end("Welcome.\n");
  }
  // /about route
  else if (path == "/about") {
    res.end("This is a simple http server.\n");
  }
  // student crud api
  else if (path == "/api/students") {
    // GET a student's data
    if (req.method == "GET") {
      knex("students")
        .where("student_id", query.id)
        .asCallback((err, rows) => {
          //if an error occurs
          if (err) {
            console.log(err);
            res.end(
              JSON.stringify({ message: "An error occured", error: err })
            );
          }
          // no error ocurred
          else {
            if (rows.length > 0) {
              res.end(JSON.stringify({ student: rows }));
            }
            // no data matched
            else {
              res.end(JSON.stringify({ message: "No data found" }));
            }
          }
        });
    }
    // INSERT a new student
    else if (req.method == "POST") {
      let newStudent = {
        student_name: query.name,
        student_grade: query.grade,
        student_age: query.age
      };
      knex("students")
        .insert(newStudent)
        .asCallback((err, rows) => {
          //if an error occurs
          if (err) {
            console.log(err);
            res.end(
              JSON.stringify({ message: "An error occured", error: err })
            );
          }
          // no error ocurred
          else {
            res.end(
              JSON.stringify({
                message: "New student data inserted"
              })
            );
          }
        });
    }
    //UPDATE an existing student
    else if (req.method == "PUT") {
      knex("students")
        .where("student_id", query.id)
        .asCallback((err, rows) => {
          //if an error occurs
          if (err) {
            res.end(
              JSON.stringify({ message: "An error occured:", error: err })
            );
            console.log(err);
          } // no error ocurred
          else {
            //data not found
            if (rows.length == 0) {
              res.end(
                JSON.stringify({
                  message: "Data not found"
                })
              );
            }
            //data found
            else {
              let updatedStudentInfo = {};
              if (query.name) updatedStudentInfo.student_name = query.name;
              if (query.grade) updatedStudentInfo.student_grade = query.grade;
              if (query.age) updatedStudentInfo.student_age = query.age;
              knex("students")
                .where("student_id", query.id)
                .update(updatedStudentInfo)
                .asCallback((err, rows) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.end(JSON.stringify({ result: rows }));
                  }
                });
            }
          }
        });
    }
    // DELETE a student data
    else if (req.method == "DELETE") {
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
                  message: "Data not found"
                })
              );
            } else {
              res.end(
                JSON.stringify({
                  message: "Deleted the item"
                })
              );
            }
          }
        });
    }
    // No method matched
    else {
      res.end(
        JSON.stringify({
          message: "Can't handle this method"
        })
      );
    }
  }
  //No route matched
  else {
    res.end("Not sure about what you want.\n");
  }
});

server.listen(3000);
