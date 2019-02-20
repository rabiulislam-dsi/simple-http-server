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
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome.");
  }

  // /about route
  else if (path == "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("This is a simple http server.");
  }

  // student crud apis

  // GET method - Get a student's data
  else if (path == "/api/students") {
    // GET a student's data
    if (req.method == "GET") {
      knex("students")
        .where("student_id", query.id)
        .asCallback((err, rows) => {
          //if an error occurs
          if (err) {
            console.log(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
          }
          // no error ocurred
          else {
            if (rows.length > 0) {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ student: rows }));
            }
            // no data matched
            else {
              res.writeHead(204, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "No Content", student: rows }));
            }
          }
        });
    }

    // POST method - INSERT a new student
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
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
          }
          // no error ocurred
          else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message: "Inserted new student data successfully"
              })
            );
          }
        });
    }

    // PUT method - UPDATE an existing student
    else if (req.method == "PUT") {
      let updatedStudentInfo = {};
      if (query.name) updatedStudentInfo.student_name = query.name;
      if (query.grade) updatedStudentInfo.student_grade = query.grade;
      if (query.age) updatedStudentInfo.student_age = query.age;

      knex("students")
        .where("student_id", query.id)
        .update(updatedStudentInfo)
        .asCallback((err, rows) => {
          //if an error occurs
          if (err) {
            console.log(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
          }
          // no error ocurred
          else {
            //if no row is affected
            if (rows == 0) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Not Found"
                })
              );
            }
            // successful update
            else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Updated student data successfully"
                })
              );
            }
          }
        });
    }

    // DELETE method - DELETE a student data
    else if (req.method == "DELETE") {
      knex("students")
        .where("student_id", query.id)
        .del()
        .asCallback((err, rows) => {
          //if an error occurs
          if (err) {
            console.log(err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
          }
          //no error occurred
          else {
            //if no rows is affected
            if (rows == 0) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Not Found"
                })
              );
            }
            // successful deletion
            else {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  message: "Deleted student data successfully"
                })
              );
            }
          }
        });
    }
    // No method matched
    else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }

  //No route matched
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000);
