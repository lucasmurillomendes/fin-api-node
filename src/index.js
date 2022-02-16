const { v4: uuidv4 } = require("uuid");

const express = require("express");
const { process_params } = require("express/lib/router");
const { response } = require("express");
const req = require("express/lib/request");

const app = express();
app.use(express.json());

const costomers = [];

// Middleware
function verifyIfExistsAccountCpf(request, response, next) {
    const { cpf } = request.headers;

    const customer = costomers.find(customer => customer.cpf === cpf);

    if (!customer) {
        return response.status(400).json({message: "Costomer not found!"});
    }

    request.customer = customer;

    return next();
}

app.post("/account", (request, response) => {
    const { cpf, name } = request.body;

    const costomerAlreadyExists = costomers.some((customer) => customer.cpf === cpf);
    
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

app.get("/statement", verifyIfExistsAccountCpf, (request, response) => {
    const { customer } = request;
    
    return response.json({
        statement: customer.statement
    });
});

app.listen(3333);