{
    let name = "Bob",
        str = `My name is ${name}`;
    console.log(str);
}

{
    let x = 2, y = 4,
        str = `X=${x},Y=${y},X+Y=${x+y}`; // X=2,Y=4,X+Y=6
    console.log(str);
}

{
    let str = `SELECT * FROM
            aTable`;
    console.log(str);
}

{
    // NEVER DO THIS! IT'S INSECURE
    var sqla = "SELECT * FROM customers WHERE customer_name = \"" + name + "\""; //ES5
    let sqlb = `SELECT * FROM customers WHERE customer_name = ${name}`; //ES2015
    console.log([sqla, sqlb]);
}

{
    // WE CAN DO THIS INSTEAD
    function sql(s, ...binds) {
    let len = binds.length;
    return { sql: s.map((val, idx)=>
                    ("" + val + (idx<len ? "?" : "")))
                    .join(""),
            binds };
    }

    let name = "Bob";
    preparedStatement = sql`SELECT * FROM customers WHERE customer_name = ${name}`;
    console.log(JSON.stringify(preparedStatement, null, 2));
    // Console outputs
    // {
    //   sql: SELECT * FROM customers WHERE customer_name = ?
    //   binds: ["Bob"]
    // }
}
