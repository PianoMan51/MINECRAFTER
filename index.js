let check_button = document.getElementById("check_button");

let item_buttons = document.querySelectorAll(".item_button");



let crafting_table = document.querySelectorAll(".crafting_td");
let check_table = [];
let item_to_craft = document.getElementById("item_to_craft");

let item_in_hand = null;

let currentItemIndex = 0;
let current_item_name = Object.keys(game_items)[currentItemIndex];
let current_item_array = game_items[current_item_name];
item_to_craft.innerHTML = `<img src="item_images/${current_item_name}.png" height="80px">`;

check_button.addEventListener("click", function () {
    for (let i = 0; i < 9; i++) {
        let item = crafting_table[i].querySelector('img');
        if (item) {
            let imageName = item.getAttribute('src').replace('item_images/', '').replace('.png', '');
            check_table.push(imageName);
        } else {
            check_table.push('');
        }
    }

    if (current_item_array.every((value, index) => value === check_table[index])) {
        goNext();
    } else {
        alert("no");
        check_table = []

    }
});

function goNext() {
    check_table = [];
    for (let i = 0; i < 9; i++) {
        crafting_table[i].innerHTML = "";
    }
    currentItemIndex++;
    current_item_name = Object.keys(game_items)[currentItemIndex];
    current_item_array = game_items[current_item_name];
    item_to_craft.innerHTML = `<img src="item_images/${current_item_name}.png" height="80px">`;

}


crafting_table.forEach(td => {
    td.addEventListener("click", function () {
        if (item_in_hand) {
            if (td.innerHTML !== "") {
                td.innerHTML = "";
            } else {
                td.innerHTML = `<img src="item_images/${item_in_hand}.png" height="80px">`;
            }
        } else {
            alert("No item chosen!")
        }
    });
});

item_buttons.forEach(item_button => {
    item_button.addEventListener("click", function () {
        item_in_hand = item_button.querySelector('img').getAttribute('src').replace('./item_images/', '').replace('.png', '');
        console.log("item in hand: " + item_in_hand)
    })

});
