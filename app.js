const mealsElement = document.getElementById('meals')
const favoriteContainer = document.getElementById('fav-meals')
const mealPopup = document.getElementById('meal-popup')
const mealInfoElement = document.getElementById('meal-info')
const popupCloseBtn = document.getElementById('close-popup')

const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')

// Функція для визначення мобільного пристрою
function isMobileDevice() {
  return (
    window.innerWidth <= 500 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  )
}

// Масив для збереження видалених на мобільних пристроях ID
let removedOnMobile = []

// Функція для очищення видалених рецептів при оновленні сторінки
function cleanupRemovedMeals() {
  const removedItems = JSON.parse(
    localStorage.getItem('removedOnMobile') || '[]'
  )

  if (removedItems.length > 0) {
    const currentFavorites = getMealsFromLocalStorage()
    const cleanedFavorites = currentFavorites.filter(
      (id) => !removedItems.includes(id)
    )

    localStorage.setItem('mealIds', JSON.stringify(cleanedFavorites))
    localStorage.removeItem('removedOnMobile')
  }
}

// Зберігати видалені на мобільних пристроях елементи в localStorage
function saveRemovedToStorage() {
  localStorage.setItem('removedOnMobile', JSON.stringify(removedOnMobile))
}

// Функція для м'якого оновлення улюблених на мобільних пристроях
function softUpdateFavorites() {
  if (isMobileDevice()) {
    // На мобільних пристроях додаємо тільки нові елементи
    const currentFavorites = getMealsFromLocalStorage()
    const existingIds = Array.from(favoriteContainer.children)
      .map((li) => li.getAttribute('data-meal-id'))
      .filter(Boolean)

    const newIds = currentFavorites.filter((id) => !existingIds.includes(id))

    // Додаємо тільки нові рецепти
    newIds.forEach(async (mealId) => {
      const meal = await getMealById(mealId)
      addMealToFavorites(meal)
    })
  } else {
    // На десктопі - повне оновлення
    fetchFavorites()
  }
}

// Виконуємо очищення при завантаженні сторінки
cleanupRemovedMeals()

getRandomMeal()
fetchFavorites()

async function getRandomMeal() {
  const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
  const respData = await resp.json()
  const randomMeal = respData.meals[0]

  addMeal(randomMeal, true)
}

async function getMealById(id) {
  const resp = await fetch(
    'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id
  )

  const respData = await resp.json()
  const meal = respData.meals[0]

  return meal
}

async function getMealsBySearch(term) {
  const resp = await fetch(
    'https://www.themealdb.com/api/json/v1/1/search.php?s=' + term
  )

  const respData = await resp.json()
  const meals = respData.meals

  return meals
}

function addMeal(mealData, random = false) {
  console.log(mealData)

  const meal = document.createElement('div')
  meal.classList.add('meal')

  meal.innerHTML = `
        <div class="meal-header">
            ${
              random
                ? `
            <span class="random"> Random Recipe </span>`
                : ''
            }
            <img
                src="${mealData.strMealThumb}"
                alt="${mealData.strMeal}"
            />
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `

  const btn = meal.querySelector('.meal-body .fav-btn')

  btn.addEventListener('click', (event) => {
    event.stopPropagation()
    if (btn.classList.contains('active')) {
      removeMealFromLocalStorage(mealData.idMeal)
      btn.classList.remove('active')
    } else {
      addMealToLocalStorage(mealData.idMeal)
      btn.classList.add('active')
    }

    // На мобільних пристроях не оновлюємо блок улюблених при додаванні
    if (!isMobileDevice()) {
      fetchFavorites()
    } else {
      softUpdateFavorites()
    }
  })

  meal.addEventListener('click', () => {
    showMealInfo(mealData)
  })

  mealsElement.appendChild(meal)
}

function addMealToLocalStorage(mealId) {
  const mealIds = getMealsFromLocalStorage()

  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealFromLocalStorage(mealId) {
  const mealIds = getMealsFromLocalStorage()

  localStorage.setItem(
    'mealIds',
    JSON.stringify(mealIds.filter((id) => id !== mealId))
  )
}

function getMealsFromLocalStorage() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'))

  return mealIds || []
}

async function fetchFavorites() {
  favoriteContainer.innerHTML = ''

  const mealIds = getMealsFromLocalStorage()

  for (const mealId of mealIds) {
    const meal = await getMealById(mealId)

    addMealToFavorites(meal)
  }
}

function addMealToFavorites(mealData) {
  const favoriteMeal = document.createElement('li')
  favoriteMeal.setAttribute('data-meal-id', mealData.idMeal)

  favoriteMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        /><span>${mealData.strMeal}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
    `

  const btn = favoriteMeal.querySelector('.clear')

  btn.addEventListener('click', (event) => {
    event.stopPropagation()

    if (isMobileDevice()) {
      // На мобільних пристроях - тільки візуальне позначення
      favoriteMeal.classList.add('removed')
      removedOnMobile.push(mealData.idMeal)
      saveRemovedToStorage()

      // Додаємо подсказку про необхідність оновлення
      if (!document.querySelector('.mobile-refresh-hint')) {
        const hint = document.createElement('div')
        hint.className = 'mobile-refresh-hint'
        hint.style.cssText = `
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 10px;
          margin: 10px;
          text-align: center;
          font-size: 0.9rem;
          color: #856404;
        `
        hint.textContent = 'Оновіть сторінку для видалення рецептів'
        favoriteContainer.parentNode.insertBefore(hint, favoriteContainer)
      }
    } else {
      // На десктопі - стандартна поведінка
      removeMealFromLocalStorage(mealData.idMeal)
      fetchFavorites()
    }
  })

  favoriteMeal.addEventListener('click', () => {
    // Не показувати інформацію про видалені на мобільних рецепти
    if (!favoriteMeal.classList.contains('removed')) {
      showMealInfo(mealData)
    }
  })

  favoriteContainer.appendChild(favoriteMeal)
}

function showMealInfo(mealData) {
  mealInfoElement.innerHTML = ''

  const mealElement = document.createElement('div')

  const ingredients = []

  for (let i = 1; i <= 20; i++) {
    const ingredient = mealData[`strIngredient${i}`]
    const measure = mealData[`strMeasure${i}`]

    if (!ingredient) {
      break
    }

    ingredients.push(`${ingredient} - ${measure}`)
  }

  mealElement.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        />
        <p>
        ${mealData.strInstructions}
        </p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
    `

  mealInfoElement.appendChild(mealElement)

  mealPopup.classList.remove('hidden')
}

searchBtn.addEventListener('click', async () => {
  mealsElement.innerHTML = ''

  const search = searchTerm.value
  const meals = await getMealsBySearch(search)

  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal)
    })
  }
})

popupCloseBtn.addEventListener('click', () => {
  mealPopup.classList.add('hidden')
})
