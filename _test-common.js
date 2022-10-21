// Clean tables, create test data

const db = require("./db");

async function createData(){
    await db.query("DELETE FROM companies");
    await db.query("DELETE FROM invoices");
    await db.query(
        `INSERT INTO companies (code, name, description)
        VALUES 
            ('peachpie', 'Peach Pie Co', 'The best pies ever'),
            ('shoofly', 'ShooFly Pie Co', 'The best fruitless pies')
    `);
    await db.query(
        `INSERT INTO invoices(comp_code, amt, paid, add_date, paid_date)
        VALUES
            ('peachpie', 33.99, false, '2022-10-11', null),
            ('peachpie', 94.47, true, '2022-10-12', '2022-10-03'),
            ('shoofly', 1000.11, false, '2022-10-14', null)
        RETURNING id
    `);
}

module.exports = { createData };