(() => {
    let foo = "Hello";
    let bar = "World!";

    function baz() {
        return `${foo} ${bar}`;
    }

    window.baz = baz;
})();

test = (function() {
    let cheese = "cheese";
    
    function printCheese() {
        console.log(cheese);
    }

    return printCheese
}())

test();