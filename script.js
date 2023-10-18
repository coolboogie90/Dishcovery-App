// Get references to the necessary elements
const searchInput = document.querySelector('#searchInput');
const mealGrid = document.querySelector('#mealGrid');
const modal = document.querySelector('#modal');
const mealDetails = document.querySelector('#mealDetails');
const closeBtn = document.querySelector('.close');

// Hide the modal initially
modal.style.display = 'none';

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

        if(response.status !== 200){
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
    const mealItem = document.createElement('div');
    mealItem.classList.add('meal');
    mealItem.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <div class="meal-title">${meal.strMeal}</div>
    `;
    mealGrid.appendChild(mealItem);
    
    // Add click event listener to open the modal
    mealItem.addEventListener('click', function () {
        openModal(meal);
    });
}

// Function to get the list of ingredients and measurements
function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measurement = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== '') {
            ingredientsList += `<li>${ingredient} - ${measurement}</li>`;
        }
    }
    return ingredientsList;
}

// Function to open the modal and display meal details
function openModal(meal) {
    if (meal) {
        modal.style.display = 'block';
        mealDetails.innerHTML = `
            <div class="modal-content">
                <div class="modal-body">
                    <div class="meal-image">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    </div>
                    <div class="meal-info">
                        <h2>${meal.strMeal}</h2>
                        <h3>Ingredients</h3>
                        <ul class="ingredients-list">
                            ${getIngredientsList(meal)}
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <h3>Instructions</h3>
                    <p class="instructions">${meal.strInstructions}</p>
                </div>
            </div>
        `;

        // Add click event listener to close the modal
        const closeBtn = document.querySelector('.close');
        closeBtn.addEventListener('click', closeModal);
    }
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
    mealDetails.innerHTML = '';
}

// Close the modal when the user clicks outside of it 
window.addEventListener('click', function (event) {
    if (event.target === modal) {
        closeModal();
    }
});
