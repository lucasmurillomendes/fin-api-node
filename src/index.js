const { v4: uuidv4 } = require("uuid");

const express = require("express");
const { process_params } = require("express/lib/router");
const { response } = require("express");

const app = express();
app.use(express.json());

const costomers = [];

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement - []
 */
app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const costomerAlreadyExists = costomers.some((costomer) => costomer.cpf === cpf);
    
    if(costomerAlreadyExists){
        return response.status(400).json({
            error: "Costomer already exists"
        });
    }
        
    costomers.push({
        cpf,
        name,
        id : uuidv4(),
        statement: []
    });
    
    return response.status(201).send();
});

app.get("/statement/:cpf", (request, response) => {
    const { cpf } = request.params;

    const costomer = costomers.find(costomer => costomer.cpf === cpf);

    return response.json({
        statement: costomer.statement
    })
});

app.listen(3333);