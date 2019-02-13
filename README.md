# simple-http-server
A minimal http server built with nodejs.

* Usage
  
  * run the server with this command-
    ```
      $ node server.js
    ```
  * Routes - <br />
     *HOME
      ```
        GET '/'
      ```
      *ABOUT
      ```
        GET '/about'
      ```  
      *READ A STUDENT'S INFO
      ```  
        GET '/api/students?id=<>'
      ```  
      *INSERT A NEW STUDENT
      ```  
        POST '/api/students?id=<int>&name=<string>&grade=<string>&age=<int>'
      ```  
      *UPDATE A STUDENT'S INFO
      ``` 
        PUT  '/api/students?id=<int>&name=<string>&grade=<string>&age=<int>' 
      ```  
        (every query params is optional except id in PUT method)

      *DELETE A STUDENT
      ```  
        DELETE '/api/students?id=<int>'
      ```
