let check_button = document.getElementById("check_button");
let inventory_slots = document.querySelectorAll(".slot");
let inventory_counters = document.querySelectorAll(".slot_counter");
let inventory_items = document.querySelectorAll(".slot_item");
let tool_buttons = document.querySelectorAll(".tool_resource");
let resource_buttons = document.querySelectorAll(".item_resource");
let inventory = document.getElementById("inventory");
let item_to_craft = document.getElementById("item_to_craft");
let crafting_table = document.querySelectorAll(".crafting_td");
let crafting_section = document.getElementById("crafting_section");
let nav_buttons = document.querySelectorAll(".nav_button");
let sections = document.querySelectorAll(".section");
let check_table = [];
let item_counter = Array(inventory_slots.length).fill(0);
let currentItemIndex = 0;
let current_item = game_items[currentItemIndex];
let current_item_recipe = null;
let score = document.getElementById("points");
let points = 0;
let life = 10;
score.innerHTML = points;
item_to_craft.innerHTML = `<img src="item_images/${current_item}.png" height="80px">`;

let item_in_hand = null;
let active_res_tool = null;
let recipe_folder = null;

crafting_table.forEach((td) => {
  td.addEventListener("click", function () {
    console.log(td)
    if (item_in_hand) {
      if (td.innerHTML === "") {
        td.innerHTML = `<img src="item_images/${item_in_hand}.png" height="80px">`;
      } else {
        td.innerHTML = "";
      }
    } else {
      td.innerHTML = "";
    }
  });
});

inventory_items.forEach((inv_item) => {
  inv_item.addEventListener("click", function () {
    if (inv_item.parentNode.classList.contains("active_item")) {
      inv_item.parentNode.classList.remove("active_item");
      item_in_hand = null;
    } else {
      inventory_items.forEach((inv_item) =>
        inv_item.parentNode.classList.remove("active_item")
      );
      item_in_hand = null;
      item_in_hand = inv_item.querySelector("img").getAttribute("src").replace("item_images/", "").replace(".png", "");
      inv_item.parentNode.classList.add("active_item");
    }
  });
});

tool_buttons.forEach((tools) => {
  tools.addEventListener("click", function () {
    if (tools.classList.contains("active_item")) {
      tools.classList.remove("active_item");
    } else {
      tool_buttons.forEach((btn) => btn.classList.remove("active_item"));
      item_in_hand = tools
        .querySelector("img")
        .getAttribute("src")
        .replace("./item_images/", "")
        .replace(".png", "");
      tools.classList.add("active_item");
      active_res_tool = tools;
    }
  });
});

nav_buttons.forEach((button) => {
  button.addEventListener("click", function () {
    sections.forEach((section) => {
      section.style.display = "none";
      item_in_hand = null;
    });

    let direction = Array.from(button.classList)[1];
    document.getElementById(direction).style.display = "flex";
  });
});

resource_buttons.forEach((resource) => {
  resource.addEventListener("click", function () {
    if (active_res_tool) {
      let tool = active_res_tool.classList;
      let res_output = null;

      if (tool.contains("resource_axe") && resource.classList.contains("resource_axe")
      ) {
        if (resource.id === "res_oak") {
          res_output = "oak_log";
        }
      }
      if (tool.contains("resource_pickaxe") && resource.classList.contains("resource_pickaxe")
      ) {
        if (resource.id === "res_stone") {
          res_output = "cobblestone";
        }
        if (resource.id === "res_coal_ore") {
          res_output = "coal";
        }
        if (resource.id === "res_iron_ore") {
          res_output = "iron_ingot";
        }
        if (resource.id === "res_redstone_ore") {
          res_output = "redstone";
        }
        if (resource.id === "res_gold_ore") {
          res_output = "gold_ingot";
        }
        if (resource.id === "res_diamond_ore") {
          res_output = "diamond";
        }
      }
      if (
        tool.contains("resource_shovel") &&
        resource.classList.contains("resource_shovel")
      ) {
        if (resource.id === "res_sand") {
          res_output = "sand";
        }
      }
      fillInventory(res_output);
    } else {
      console.log("hand ouch");
    }
  });
});

function fillInventory(output) {
  let item = `<img src="item_images/${output}.png" height="90px">`;
  for (let i = 0; i < inventory_slots.length; i++) {
    if (output) {
      if (inventory_items[i].innerHTML === "") {
        inventory_items[i].innerHTML = item;
        item_counter[i]++;
        inventory_counters[i].innerHTML = item_counter[i];
        break;
      } else {
        let current_item = inventory_items[i]
          .querySelector("img")
          .getAttribute("src")
          .replace("item_images/", "")
          .replace(".png", "");

        if (current_item === output) {
          item_counter[i]++;
          inventory_counters[i].innerHTML = item_counter[i];
          break;
        }
      }
    }
  }
}

function getRecipe() {
  fetch(`recipes/${current_item}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((recipe) => {
      current_item_recipe = recipe;
    })
    .catch((error) => {
      console.error("Error fetching JSON file:", error);
    });
}

check_button.addEventListener("click", function () {
  for (let i = 0; i < 9; i++) {
    let item = crafting_table[i].querySelector("img");
    if (item) {
      let imageName = item
        .getAttribute("src")
        .replace("item_images/", "")
        .replace(".png", "");
      check_table.push(imageName);
    } else {
      check_table.push("");
    }
  }
  if (checkRecipeType(current_item_recipe, check_table)) {
    goNext();
    crafting_section.classList.add("success_flash");
    setTimeout(function () {
      crafting_section.classList.remove("success_flash");
    }, 50);
    item_in_hand = null;
    //active_inv_item.classList.remove("active_item");
    points++;
    score.innerHTML = points;
  } else {
    crafting_section.classList.add("error_flash");
    setTimeout(function () {
      crafting_section.classList.remove("error_flash");
    }, 50);
    item_in_hand = null;
    //if (active_inv_item) {
    //   active_inv_item.classList.remove("active_item");
    //}
    life--;
    removeLife();
    score.innerHTML = points;
    check_table = [];
    crafting_table.forEach((td) => {
      td.innerHTML = "";
    });
    checkRecipeType(current_item_recipe, check_table);
  }
});

function checkRecipeType(recipe, input) {
  if (recipe.type === "minecraft:crafting_shaped") {
    //console.clear();
    return checkShapedRecipe(recipe, input);
  } else if (recipe.type === "minecraft:crafting_shapeless") {
    //console.clear();
    return checkShapelessRecipe(recipe, input);
  }

  return false;
}

function checkShapedRecipe(recipe, input) {
  let pattern = recipe.pattern;
  let key = recipe.key;
  let flatPattern = pattern.join("");
  let keyItems = {};

  let recipe_col = recipe.pattern.reduce(
    (max, row) => Math.max(max, row.length),
    0
  );
  let recipe_row = pattern.length;

  if (recipe_col === 2) {
    let adjustedPattern_right = pattern.map((row) => row + " ");
    let adjustedPattern_left = pattern.map((row) => " " + row);

    if (!checkPattern(adjustedPattern_right.join(""))) {
      if (!checkPattern(adjustedPattern_left.join(""))) {
        return false;
      }
    }
  } else if (recipe_col === 1) {
    let adjustedPattern_right = pattern.map((row) => row + "  ");
    let adjustedPattern_left = pattern.map((row) => "  " + row);
    let adjustedPattern_middle = pattern.map((row) => " " + row + " ");

    if (!checkPattern(adjustedPattern_right.join(""))) {
      if (!checkPattern(adjustedPattern_left.join(""))) {
        if (!checkPattern(adjustedPattern_middle.join(""))) {
          return false;
        }
      }
    }
  } else if (recipe_row === 2) {
    let adjustedPattern_top = ["   ", ...pattern];
    let adjustedPattern_bottom = [...pattern, "   "];

    if (!checkPattern(adjustedPattern_top.join(""))) {
      if (!checkPattern(adjustedPattern_bottom.join(""))) {
        return false;
      }
    }
  } else if ((recipe_col === 3) & (recipe_row === 3)) {
    if (!checkPattern(flatPattern)) {
      return false;
    }
  }

  function checkPattern(flatPattern) {
    for (let i = 0; i < 9; i++) {
      if (flatPattern[i] !== " ") {
        keyItems[i] = key[flatPattern[i]].item;
      } else {
        keyItems[i] = null;
      }
    }

    for (let i = 0; i < 9; i++) {
      let expectedItem = keyItems[i];
      let actualItem = input[i] !== "" ? "minecraft:" + input[i] : "";

      if (expectedItem === null && actualItem !== "") {
        return false;
      }

      if (expectedItem !== null && expectedItem !== actualItem) {
        return false;
      }
    }
    return true;
  }

  return true;
}

function checkShapelessRecipe(recipe, input) {
  let ingredients = recipe.ingredients.map((ingredient) => ingredient.item);

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

  getRecipe();
}

function removeLife() {
  let hearts = document.getElementById("health_bar");
  hearts.innerHTML = "";

  for (let i = 0; i < life; i++) {
    let full = document.createElement("div");
    full.classList.add("heart");
    full.innerHTML = `<img src="heart.png">`;
    hearts.append(full);
  }

  for (let i = 0; i < 10 - life; i++) {
    let empty = document.createElement("div");
    empty.classList.add("heart");
    empty.innerHTML = `<img src="heart_empty.png">`;
    hearts.append(empty);
  }

  if (life === 0) {
    gameOver();
  }
}

function gameOver() {
  alert("Game over!");
  life = 10;
  removeLife();
  currentItemIndex = 0;
}

removeLife();
getRecipe();
