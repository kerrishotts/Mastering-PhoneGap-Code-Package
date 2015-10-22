{
    let { a, b } = { a: 5, b: 10 };
    console.log([a, b]);  // 5 10
}

{
    let { a, b = 10 } = { a: 5 }; // a = 5, b = 10
    console.log([a, b]);
}

{
    let { a: { b, c = 10 } } = { a: { b: 5 } };
    console.log([b, c]); // 5, 10; a is undefined
}

{
    let [state, capitol] = ["Illinois", "Springfield"];
    console.log([state, capitol]);
}

{
    let [a, , c] = [1, 2, 3];
    console.log([a, c]); // 1 3
}

{
    let [a, ...b] = [1, 2, 3];
    console.log([a, b]); // 1, [2, 3]
}

{
    let {c, ...d} = {c: 5, d: 10, e: 15}
    console.log([c, d]); // 5, {d: 10, e: 15}
}

