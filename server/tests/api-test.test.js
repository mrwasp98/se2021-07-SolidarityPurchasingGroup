'use strict';


// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes
const app = require("../server.js");

describe('Testing test route',()=>{

    afterAll(async ()=>{
        app.close();
    });

    test('It should respond with backend ok',async()=>{
        const response =await request(app).get('/api/test');
        expect(response.body.textsent).toBe('backend ok!')
    });

});