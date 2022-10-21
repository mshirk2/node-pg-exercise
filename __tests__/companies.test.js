// Test for Companies

const request = require("supertest");
const app = require("../app");
const { createData } = require("../_test-common");
let db = require("../db");


//////////////// Test setup and teardown
beforeEach(createData);

afterAll(async () => {
    await db.end()
});


//////////////// GET /companies
// returns `{companies: [company, ...]}`

describe("GET /", function() {
    test("Gets a list of companies", async function() {
        const resp = await request(app).get(`/companies`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            "companies": [
                {code: "peachpie", name: "Peach Pie Co"},
                {code: "shoofly", name: "ShooFly Pie Co"},
            ]
        });
    });
});

//////////////// GET /companies/:code
// returns `{company: {code:..}}`

describe("GET /:code", function() {
    test("Gets a specific company", async function() {
        const resp = await request(app).get(`/companies/peachpie`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            "company": {
                code: "peachpie",
                name: "Peach Pie Co",
                description: "The best pies ever",
                invoices: [1, 2],
            }
        });
    });

    test("Returns 404 if company not found", async function(){
        const resp = await request(app).get("/companies/gnrelw;airgew");
        
        expect(resp.status).toEqual(404);
    })
});




//////////////// POST /companies
// create company from data; return company

describe("POST /", function() {
    test("Creates a new company", async function() {
        const resp = await request(app)
            .post(`/companies`)
            .send({name: "BreakfastEnterprises", description: "Brave New Bagels"});

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({
            "company": {
                code: "breakfastenterprises",
                name: "BreakfastEnterprises",
                description: "Brave New Bagels", 
            }
        });
    });

    test("Returns 500 for conflict", async function(){
        const resp = await request(app)
            .post("/companies")
            .send({name: "Peach Pie Co", description: "Delicious with Peanut Butter"});
        expect(resp.status).toEqual(500);
    })
});




//////////////// PATCH /companies/[code]
// update company; return `{company: company}`

describe("PATCH /:code", function() {
    test("Updates a single company", async function() {
        const resp = await request(app)
            .patch(`/companies/peachpie`)
            .send({name: "Gerkins"});

        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toEqual({
            company: { name: "Gerkins" }
      });
    });
  
    test("Responds with 404 if company not found", async function() {
        const resp = await request(app).patch(`/companies/sfedves`);
        expect(resp.statusCode).toEqual(404);
    });
});

//////////////// DELETE /companies/[name]
// delete company, return delete message

describe("DELETE /:code", function() {
    test("Deletes a single a company", async function() {
        const resp = await request(app).delete(`/companies/peachpie`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Deleted" });
    });

    test("Responds with 404 if company not found", async function() {
        const resp = await request(app).delete(`/companies/sfedves`);
        expect(resp.statusCode).toEqual(404);
    });
});