import * as categoriesController from "../controllers/categoriesController.js";

export function initCategoryAutoComplete() {
    const inputs = document.querySelectorAll(".category-input");
    if (!inputs) return;
    
    inputs.forEach((input) => {
        input.addEventListener("input", (event) => {
            const value = event.target.value;
            const type = event.target.dataset.type;
            categoriesController.handleCategoryTyping(value, type);
        });
    });

    categoriesController.getCategories();
}

export function renderCategorySuggestions(categories, type) {
    const box = document.querySelector(`.category-suggestions[data-type="${type}"]`);

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
            selectCategory(category, box);
        });

        box.appendChild(div);
    });

    box.style.display = "block";

    window.addEventListener("click", (event) => {
        if (!box.contains(event.target)) {
            clearCategorySuggestions(box);
        }
    });
}

export function clearCategorySuggestions(box) {
    if(!box) return;
    box.innerHTML = "";
    box.style.display = "none";
    
}

function selectCategory(category, box) {
    const inputs = document.querySelectorAll(".category-input");
    inputs.forEach((input) => {
        input.value = category.name;
    });
    clearCategorySuggestions(box);
}

