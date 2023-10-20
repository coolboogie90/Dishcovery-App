// Get references to the necessary elements
const searchInput = document.querySelector('#searchInput');
const mealGrid = document.querySelector('#mealGrid');
const modal = document.querySelector('#modal');
const mealDetails = document.querySelector('#mealDetails');
const mealTemplate = document.getElementById('mealTemplate');
const closeBtn = document.querySelector('.close');
let isOpen = false;
const dialog = document.querySelector("dialog");


// Add event listener to the search input
searchInput.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
        const searchTerm = searchInput.value;
        try {
            await fetchMeals(searchTerm);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    }
});

// Function to fetch meals from the API
async function fetchMeals(searchTerm) {
    // Clear the meal grid
    mealGrid.innerHTML = '';

    try {
        // Fetch meals from the API
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        const data = await response.json();
        //Avec destructuring du data.meals, on crée une variable meals qui va auto créer une array avec les propriétés
        //const {meals} = await res.json();

        if (response.status !== 200) {
            throw new Error("Cannot get response", response.status);
        }

        const meals = data.meals;
        if (meals) {
            // Display the meals in the grid
            meals.forEach(meal => {
                displayMeal(meal);
            });
        } else {
            // Show a message if no meals found
            mealGrid.innerHTML = 'No meals found.';
        }
    } catch (error) {
        throw new Error('Error fetching meals:', error);
    }
}

// Function to display a meal in the grid
function displayMeal(meal) {
    // Clone the meal template
    const mealItem = mealTemplate.content.cloneNode(true);

    // Update values with meal data
    const mealImage = mealItem.querySelector('.meal-image');
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;

    const mealTitle = mealItem.querySelector('.meal-title');
    mealTitle.textContent = meal.strMeal;

    // Add clone to mealGrid
    mealGrid.appendChild(mealItem);

    // Event to open modal
    const mealElement = mealGrid.lastElementChild;
    mealElement.addEventListener('click', () => {
        openModal(meal);
    });
}

// Function to get the meal details
function getMealDetails(meal) {
    let details = '';

    details += `
    <div class="modal-content">
        <div class="modal-body">
            <div class="meal-image">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <br>
            <div class="meal-info">
                <h2>${meal.strMeal}</h2>
                <h3>Ingredients</h3>
                <br>
                <ul class="ingredients-list">
                    ${getIngredientsList(meal)}
                </ul>
            </div>
        </div>
        <div class="modal-footer">
            <h3>Instructions</h3>
            <br>
            <p class="instructions">${meal.strInstructions}</p>
        </div>
    </div>
    `;

    return details;
}

// Function to get the list of ingredients and measurements
function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measurement = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredientsList += `<li>${i}) ${ingredient} - ${measurement}</li>`;
        }
    }
    return ingredientsList;
}

// Function to open the modal with meal details
function openModal(meal) {
    // Update the meal details in the modal
    mealDetails.innerHTML = getMealDetails(meal);

    // Show the modal
    //isOpen = true
    modal.showModal();
}

// Function to close the modal
const closeModal = () => {
    modal.close();

}

// Add event listener to close the modal when clicking on the "x" button
closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.close();
    }
});



