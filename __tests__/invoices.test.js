// Tests for Invoices

const request = require("supertest");
const app = require("../app");
const { createData } = require("../_test-common");
let db = require("../db");


//////////////// Test setup and teardown
beforeEach(createData);

afterAll(async () => {
    await db.end()
});


//////////////// GET /invoices
// returns `{invoices: [invoice, ...]}`

describe("GET /", function() {
    test("Gets a list of invoices", async function() {
        const resp = await request(app).get(`/invoices`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            "invoices": [
                {id: 1, comp_code:'peachpie'},
                {id: 2, comp_code:'peachpie'},
                {id: 3, comp_code:'shoofly'},
            ]
        });
    });
});

//////////////// GET /invoices/:id
// returns `{invoice: {comp_code:..}}`

describe("GET /:id", function() {
    test("Gets a specific invoice", async function() {
        const resp = await request(app).get(`/invoices/0`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            "invoice": {id: 1, 
                amt: 33.99, 
                paid: false, 
                add_date: '2022-10-11',  
                paid_date: null,
                company:{
                    code: 'peachpie',
                    name: 'Peach Pie Co',
                    description: 'The best pies ever',
                }
            }
        });
    });

    test("Returns 404 if invoice not found", async function(){
        const resp = await request(app).get("/invoices/dsfger");
        
        expect(resp.status).toEqual(404);
    })
});




//////////////// POST /invoices
// create invoice from data; return invoice

describe("POST /", function() {
    test("Creates a new invoice", async function() {
        const resp = await request(app)
            .post(`/invoices`)
            .send({
                comp_code:'shoofly', 
                amt: 204.70, 
            });

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toContain({
            "invoice": {
                id: 4,
                comp_code:'shoofly', 
                amt: 204.70, 
                add_date: expect.any(String),
                paid: false, 
                paid_date: null,
            }
        });
    });

});


//////////////// PATCH /invoices/[id]
// update invoice; return `{invoice: invoice}`

describe("PATCH /:code", function() {
    test("Updates a single invoice", async function() {
        const resp = await request(app)
            .patch(`/invoices/1`)
            .send({amt: 45.44, paid: false});

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            invoice: { 
                id: 1,
                comp_code: 'peachpie',
                amt: 45.44,
                add_date: expect.any(String),
                paid_date: null,}
      });
    });
  
    test("Responds with 404 if invoice not found", async function() {
        const resp = await request(app).patch(`/invoices/dsfger`);
        expect(resp.statusCode).toEqual(404);
    });
});

//////////////// DELETE /invoices/[id]
// delete invoice, return delete message

describe("DELETE /:id", function() {
    test("Deletes a single a invoice", async function() {
        const resp = await request(app).delete(`/invoices/1`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Deleted" });
    });

    test("Responds with 404 if invoice not found", async function() {
        const resp = await request(app).delete(`/invoices/dsfger`);
        expect(resp.statusCode).toEqual(404);
    });
});