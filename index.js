let check_button = document.getElementById("check_button");
let item_buttons = document.querySelectorAll(".item_button");
let item_to_craft = document.getElementById("item_to_craft");
let crafting_table = document.querySelectorAll(".crafting_td");
let check_table = [];
let currentItemIndex = 0;
let current_item = game_items[currentItemIndex];
let current_item_recipe = null
item_to_craft.innerHTML = `<img src="item_images/${current_item}.png" height="80px">`;


let item_in_hand = null;
let recipe_folder = null;


function getRecipe() {
    fetch(`recipes/${current_item}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(recipe => {
            current_item_recipe = recipe;
            console.log(current_item_recipe.pattern)
        })
        .catch(error => {
            console.error('Error fetching JSON file:', error);
        });
}

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
    if (checkRecipe(current_item_recipe, check_table)) {
        goNext();
    } else {
        alert("Incorrect recipe!");
        check_table = [];
        checkRecipe(current_item_recipe, check_table)
    }

});

function checkRecipe(recipe, input) {

    if (recipe.type === "minecraft:crafting_shaped") {
        console.clear();
        return checkShapedRecipe(recipe, input);
    } else if (recipe.type === "minecraft:crafting_shapeless") {
        console.clear();
        return checkShapelessRecipe(recipe, input);
    }

    return false;
}

function checkShapedRecipe(recipe, input) {
    let pattern = recipe.pattern;

    let key = recipe.key;
    let flatPattern = pattern.join('');
    let keyItems = {};

    for (let i = 0; i < 9; i++) {
        if (flatPattern[i] !== ' ') {
            keyItems[i] = key[flatPattern[i]].item;
        } else {
            keyItems[i] = null;
        }
    }

    for (let i = 0; i < 9; i++) {
        let expectedItem = keyItems[i];
        let actualItem = input[i] !== '' ? "minecraft:" + input[i] : '';

        console.log(i + " " + expectedItem + " --> " + actualItem);


        if (expectedItem === null && actualItem !== '') {
            return false;
        }

        if (expectedItem !== null && expectedItem !== actualItem) {
            return false;
        }
    }

    return true;
}

function checkShapelessRecipe(recipe, input) {
    let ingredients = recipe.ingredients.map(ingredient => ingredient.item);

    for (let item of input) {
        let index = ingredients.indexOf(item);
        if (index !== -1) {
            ingredients.splice(index, 1);
        }
    }

    return ingredients.length === 0;
}

function goNext() {
    check_table = [];
    for (let i = 0; i < 9; i++) {
        crafting_table[i].innerHTML = "";
    }
    currentItemIndex++;
    current_item = game_items[currentItemIndex];
    item_to_craft.innerHTML = `<img src="item_images/${current_item}.png" height="80px">`;

    // Fetch the recipe for the new current item
    getRecipe();
}



getRecipe()

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
        item_buttons.forEach(btn => btn.classList.remove("active_item"));

        item_in_hand = item_button.querySelector('img').getAttribute('src').replace('./item_images/', '').replace('.png', '');
        item_button.classList.add("active_item");
    });
});

