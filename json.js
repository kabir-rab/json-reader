const fs = require('fs');
let jsonObject;

// function to read a json file from a given location and return that in response
// required user to provide "path" parameter when making the GET request.
// example - http://localhost:3000/json?path=D:\jsonfile.json
const getJson = (request, response) => { 
    if(!request.query.path){
        response.status(400).json({error: 'no path parameter provided. Please provide a local/network file path. ex - path=C:\jsonfile.json'});
    }
    else{
        fs.readFile(request.query.path, (err, data) => {
            if (err) { 
                response.status(500).send(err); 
            }
            else{
                jsonObject = JSON.parse(data);
                response.status(200).send(jsonObject);
            };        
        }); 
    }          
}

module.exports = {
    getJson
}