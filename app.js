/* API Service for working with TheMealDB API */
const createAPIService = () => {
  const baseURL = 'https://www.themealdb.com/api/json/v1/1'

  const fetchWithErrorHandling = async (url, errorMessage) => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(errorMessage)
      return await response.json()
    } catch (error) {
      console.error(errorMessage + ':', error)
      throw error
    }
  }

  const getRandomMeal = async () => {
    const data = await fetchWithErrorHandling(
      `${baseURL}/random.php`,
      'Failed to fetch random meal'
    )
    return data.meals[0]
  }

  const getMealById = async (id) => {
    const data = await fetchWithErrorHandling(
      `${baseURL}/lookup.php?i=${id}`,
      'Failed to fetch meal by ID'
    )
    return data.meals[0]
  }
  const getMealsBySearch = async (term) => {
    const data = await fetchWithErrorHandling(
      `${baseURL}/search.php?s=${term}`,
      'Failed to search meals'
    )
    return data.meals
  }

  return {
    getRandomMeal,
    getMealById,
    getMealsBySearch,
  }
}

/* Storage Service for working with localStorage */
const createStorageService = () => {
  const keys = {
    MEAL_IDS: 'mealIds',
    FAVORITES_EXPANDED: 'favoritesExpanded',
  }

  const safeJSONParse = (item, fallback = []) => {
    try {
      return JSON.parse(localStorage.getItem(item)) || fallback
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return fallback
    }
  }

  const getFavoriteMealIds = () => {
    return safeJSONParse(keys.MEAL_IDS, [])
  }

  const addFavoriteMeal = (mealId) => {
    const mealIds = getFavoriteMealIds()
    if (!mealIds.includes(mealId)) {
      // Add new meal to the beginning of the list (LIFO)
      localStorage.setItem(keys.MEAL_IDS, JSON.stringify([mealId, ...mealIds]))
    }
  }

  const removeFavoriteMeal = (mealId) => {
    const mealIds = getFavoriteMealIds()
    const updatedIds = mealIds.filter((id) => id !== mealId)
    localStorage.setItem(keys.MEAL_IDS, JSON.stringify(updatedIds))
  }

  const isFavoritesExpanded = () => {
    return localStorage.getItem(keys.FAVORITES_EXPANDED) === 'true'
  }

  const setFavoritesExpanded = (expanded) => {
    localStorage.setItem(keys.FAVORITES_EXPANDED, expanded.toString())
  }

  return {
    getFavoriteMealIds,
    addFavoriteMeal,
    removeFavoriteMeal,
    isFavoritesExpanded,
    setFavoritesExpanded,
  }
}

/* Cache Manager for managing meals cache */
const createCacheManager = () => {
  const mealsCache = new Map()
  let lastFavoritesOrder = ''

  return {
    getMeal(mealId) {
      return mealsCache.get(mealId)
    },

    setMeal(mealId, mealData) {
      mealsCache.set(mealId, mealData)
    },

    removeMeal(mealId) {
      mealsCache.delete(mealId)
    },

    clear() {
      mealsCache.clear()
      lastFavoritesOrder = ''
    },

    getLastFavoritesOrder() {
      return lastFavoritesOrder
    },

    setLastFavoritesOrder(order) {
      lastFavoritesOrder = order
    },
  }
}

/* UI Manager for managing user interface */
const createUIManager = () => {
  const elements = {
    meals: document.getElementById('meals'),
    favoriteContainer: document.getElementById('fav-meals'),
    mealPopup: document.getElementById('meal-popup'),
    mealInfo: document.getElementById('meal-info'),
    popupCloseBtn: document.getElementById('close-popup'),
    searchTerm: document.getElementById('search-term'),
    searchBtn: document.getElementById('search'),
    favToggle: document.getElementById('fav-toggle'),
    favContainer: document.querySelector('.fav-container'),
    favMeals: document.querySelector('.fav-meals'),
  }

  const createElement = (tag, className = '', innerHTML = '') => {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (innerHTML) element.innerHTML = innerHTML
    return element
  }

  const extractIngredients = (mealData, maxIngredients = 20) => {
    const ingredients = []
    for (let i = 1; i <= maxIngredients; i++) {
      const ingredient = mealData[`strIngredient${i}`]
      const measure = mealData[`strMeasure${i}`]

      if (!ingredient) break
      ingredients.push(`${ingredient} - ${measure}`)
    }
    return ingredients
  }

  return {
    elements,

    createElement,

    createMealElement(mealData, isRandom = false) {
      const meal = createElement('div', 'meal')
      meal.mealData = mealData

      meal.innerHTML = `
        <div class="meal-header">
          ${isRandom ? '<span class="random">Random Recipe</span>' : ''}
          <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
        </div>
        <div class="meal-body">
          <h4>${mealData.strMeal}</h4>
          <button class="fav-btn">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      `

      return meal
    },

    createFavoriteMealElement(mealData) {
      const favoriteMeal = createElement('li')
      favoriteMeal.setAttribute('data-meal-id', mealData.idMeal)

      favoriteMeal.innerHTML = `
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
        <span>${mealData.strMeal}</span>
        <button class="clear"><i class="fas fa-window-close"></i></button>
      `

      return favoriteMeal
    },

    createMealInfoElement(mealData) {
      const ingredients = extractIngredients(mealData)

      return createElement(
        'div',
        '',
        `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
        <p>${mealData.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
        </ul>
      `
      )
    },

    clearContainer(container) {
      container.innerHTML = ''
    },

    updateFavoritesCount(count) {
      const favTitle = elements.favToggle.querySelector('.fav-count')
      favTitle.textContent =
        count > 0 ? `Favorite Meals (${count})` : 'Favorite Meals'
    },

    updateOverflowIndicator() {
      if (!elements.favContainer.classList.contains('expanded')) {
        const hasOverflow =
          elements.favMeals.scrollHeight > elements.favMeals.clientHeight
        elements.favContainer.classList.toggle('has-overflow', hasOverflow)
      } else {
        elements.favContainer.classList.remove('has-overflow')
      }
    },

    resetFavoritesScroll() {
      if (elements.favMeals) {
        elements.favMeals.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    preserveScrollPosition(callback) {
      const scrollPosition = elements.favMeals?.scrollTop || 0
      callback()

      if (scrollPosition > 0) {
        requestAnimationFrame(() => {
          if (elements.favMeals) {
            elements.favMeals.scrollTop = scrollPosition
          }
        })
      }
    },

    showMealPopup() {
      elements.mealPopup.classList.remove('hidden')
    },

    hideMealPopup() {
      elements.mealPopup.classList.add('hidden')
    },

    isMobileDevice() {
      return (
        window.innerWidth <= 500 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
    },
  }
}

/*Main function for creating Recipe App */
const createRecipeApp = () => {
  const apiService = createAPIService()
  const storageService = createStorageService()
  const cacheManager = createCacheManager()
  const uiManager = createUIManager()

  // Private functions
  const setupEventListeners = () => {
    // Meal search
    uiManager.elements.searchBtn.addEventListener('click', handleSearch)
    uiManager.elements.searchTerm.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSearch()
    })

    // Close popup
    uiManager.elements.popupCloseBtn.addEventListener('click', () => {
      uiManager.hideMealPopup()
    })

    // Toggle favorites
    uiManager.elements.favToggle.addEventListener('click', toggleFavorites)

    // Close popup when clicking outside
    uiManager.elements.mealPopup.addEventListener('click', (e) => {
      if (e.target === uiManager.elements.mealPopup) {
        uiManager.hideMealPopup()
      }
    })
  }

  const loadRandomMeal = async () => {
    try {
      const randomMeal = await apiService.getRandomMeal()
      addMealToUI(randomMeal, true)
    } catch (error) {
      console.error('Failed to load random meal:', error)
    }
  }

  const handleSearch = async () => {
    const searchTerm = uiManager.elements.searchTerm.value.trim()
    if (!searchTerm) return

    uiManager.clearContainer(uiManager.elements.meals)

    try {
      const meals = await apiService.getMealsBySearch(searchTerm)

      if (meals) {
        meals.forEach((meal) => addMealToUI(meal))
        updateAllHeartButtons()
      } else {
        showNoResultsMessage()
      }
    } catch (error) {
      console.error('Search failed:', error)
      showErrorMessage('Search failed. Please try again.')
    }
  }

  const addMealToUI = (mealData, isRandom = false) => {
    const mealElement = uiManager.createMealElement(mealData, isRandom)
    const favBtn = mealElement.querySelector('.fav-btn')

    // Check favorite status
    const favoriteIds = storageService.getFavoriteMealIds()
    if (favoriteIds.includes(mealData.idMeal)) {
      favBtn.classList.add('active')
    }

    // Handler for favorite button
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      toggleFavorite(mealData, favBtn)
    })

    // Handler for opening meal details
    mealElement.addEventListener('click', () => showMealDetails(mealData))

    uiManager.elements.meals.appendChild(mealElement)
  }

  const toggleFavorite = (mealData, favBtn) => {
    const favoriteIds = storageService.getFavoriteMealIds()
    const isCurrentlyFavorite = favoriteIds.includes(mealData.idMeal)

    if (isCurrentlyFavorite) {
      storageService.removeFavoriteMeal(mealData.idMeal)
      cacheManager.removeMeal(mealData.idMeal)
      favBtn.classList.remove('active')
    } else {
      storageService.addFavoriteMeal(mealData.idMeal)
      favBtn.classList.add('active')
    }

    loadFavorites()
    updateAllHeartButtons()
  }

  const loadFavorites = async () => {
    const mealIds = storageService.getFavoriteMealIds()
    const currentOrder = mealIds.join(',')

    // Optimization: check if order has changed
    if (
      currentOrder === cacheManager.getLastFavoritesOrder() &&
      uiManager.elements.favoriteContainer.children.length === mealIds.length
    ) {
      updateFavoritesCount()
      return
    }

    const shouldPreserveScroll = cacheManager.getLastFavoritesOrder() !== ''

    cacheManager.setLastFavoritesOrder(currentOrder)
    uiManager.clearContainer(uiManager.elements.favoriteContainer)

    // Load meals asynchronously for better performance
    const loadPromises = mealIds.map(async (mealId) => {
      let meal = cacheManager.getMeal(mealId)

      if (!meal) {
        try {
          meal = await apiService.getMealById(mealId)
          cacheManager.setMeal(mealId, meal)
        } catch (error) {
          console.error(`Failed to load meal ${mealId}:`, error)
          return null
        }
      }

      return meal
    })

    try {
      const meals = await Promise.all(loadPromises)

      // Add meals in the same order
      meals.forEach((meal) => {
        if (meal) {
          addMealToFavorites(meal)
        }
      })

      if (!shouldPreserveScroll) {
        setTimeout(() => uiManager.resetFavoritesScroll(), 100)
      }

      updateAllHeartButtons()
      updateFavoritesCount()
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }

  const addMealToFavorites = (mealData) => {
    const favMealElement = uiManager.createFavoriteMealElement(mealData)
    const clearBtn = favMealElement.querySelector('.clear')

    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      storageService.removeFavoriteMeal(mealData.idMeal)
      cacheManager.removeMeal(mealData.idMeal)
      loadFavorites()
      updateAllHeartButtons()
    })

    favMealElement.addEventListener('click', () => showMealDetails(mealData))

    uiManager.elements.favoriteContainer.appendChild(favMealElement)
  }

  const showMealDetails = (mealData) => {
    uiManager.clearContainer(uiManager.elements.mealInfo)
    const mealInfoElement = uiManager.createMealInfoElement(mealData)
    uiManager.elements.mealInfo.appendChild(mealInfoElement)
    uiManager.showMealPopup()
  }

  const updateAllHeartButtons = () => {
    const favoriteIds = storageService.getFavoriteMealIds()
    const heartButtons = document.querySelectorAll('.fav-btn')

    heartButtons.forEach((btn) => {
      const mealElement = btn.closest('.meal')
      if (mealElement?.mealData) {
        btn.classList.toggle(
          'active',
          favoriteIds.includes(mealElement.mealData.idMeal)
        )
      }
    })
  }

  const toggleFavorites = () => {
    uiManager.elements.favContainer.classList.toggle('expanded')

    const isExpanded =
      uiManager.elements.favContainer.classList.contains('expanded')
    storageService.setFavoritesExpanded(isExpanded)

    if (!isExpanded) {
      setTimeout(() => uiManager.resetFavoritesScroll(), 50)
    }

    setTimeout(() => uiManager.updateOverflowIndicator(), 100)
  }

  const restoreFavoritesState = () => {
    if (storageService.isFavoritesExpanded()) {
      uiManager.elements.favContainer.classList.add('expanded')
    }

    setTimeout(() => uiManager.resetFavoritesScroll(), 100)
  }

  const updateFavoritesCount = () => {
    const count = storageService.getFavoriteMealIds().length
    uiManager.updateFavoritesCount(count)

    if (count === 0) {
      cacheManager.clear()
    }

    uiManager.updateOverflowIndicator()
  }

  const showNoResultsMessage = () => {
    const noResults = uiManager.createElement(
      'div',
      'no-results',
      '<p>No meals found. Try a different search term.</p>'
    )
    uiManager.elements.meals.appendChild(noResults)
  }

  const showErrorMessage = (message) => {
    const errorDiv = uiManager.createElement(
      'div',
      'error-message',
      `<p>${message}</p>`
    )
    uiManager.elements.meals.appendChild(errorDiv)
  }

  // Initialization
  const init = async () => {
    setupEventListeners()
    restoreFavoritesState()

    try {
      await loadRandomMeal()
      await loadFavorites()
      updateFavoritesCount()
    } catch (error) {
      console.error('Error initializing app:', error)
    }
  }

  // Public API
  return {
    init,
    loadRandomMeal,
    handleSearch,
    loadFavorites,
    updateFavoritesCount,
    toggleFavorites,
  }
}

// Initialize app after DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = createRecipeApp()
  app.init()
})
