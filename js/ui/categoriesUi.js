import * as categoriesController from "../controllers/categoriesController.js";

export async function findCategories(value) {
    return await getCategoriesNames(value);
}

export function initCategoryAutoComplete() {
    const inputs = document.querySelectorAll(".category-input");
    if (!inputs) return;

    inputs.forEach((input) => {
        input.addEventListener("input", (event) => {
            const value = event.target.value;
            categoriesController.handleCategoryTyping(value);
        });
    });

    categoriesController.getCategories();
}

export function renderCategorySuggestions(categories) {
    const box = document.querySelector(".category-suggestions");
    if (!box) return;

    box.innerHTML = "";

    if (categories === null || categories.length === 0) {
        box.style.display = "none";
        return;
    }
    
    categories.forEach(category => {
        const div = document.createElement("div");
        div.className = "category-suggestion-item";
        div.textContent = category.name;
        div.dataset.id = category.id;

        div.addEventListener("click", () => {
            selectCategory(category);
        });

        box.appendChild(div);
    });

    box.style.display = "block";

    window.addEventListener("click", (event) => {
        if (event.target != box) {
            clearCategorySuggestions();
        }
    });
}

export function clearCategorySuggestions() {
    const box = document.querySelector(".category-suggestions");

    if(box) {
        box.innerHTML = "";
        box.style.display = "none";
    }
}

function selectCategory(category) {
    const inputs = document.querySelectorAll(".category-input");
    inputs.forEach((input) => {
        input.value = category.name;
    });
    clearCategorySuggestions();
}

