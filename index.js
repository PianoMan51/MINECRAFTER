let check_button = document.getElementById("check_button");
let add_cobblestone_button = document.getElementById("add_cobblestone");
let add_stick_button = document.getElementById("add_stick");
let crafting_table = document.querySelectorAll(".crafting_td");
let add_cobblestone = false;
let add_stick = false;


check_button.addEventListener("click", function () {
    console.log(furnace);

    let check_table = [];

    for (let i = 0; i < 9; i++) {
        check_table.push(crafting_table[i].innerHTML);
    }

    console.log(check_table);

    if (stone_pickaxe.every((value, index) => value === check_table[index])) {
        alert("yes");
    } else {
        alert("no");
    }
});

crafting_table.forEach(td => {
    td.addEventListener("click", function () {

        if (add_cobblestone) {
            td.innerHTML == "" ? td.innerHTML = "cobblestone" : td.innerHTML = "";
        }
        if (add_stick) {
            td.innerHTML == "" ? td.innerHTML = "stick" : td.innerHTML = "";
        }
    })
})



add_cobblestone_button.addEventListener("click", function () {
    add_cobblestone = !add_cobblestone;
})

add_stick_button.addEventListener("click", function () {
    add_stick = !add_stick;
})

