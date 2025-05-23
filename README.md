# Recipe App

A modern, responsive web application for discovering and managing your favorite recipes. Built with vanilla JavaScript using functional programming patterns and powered by TheMealDB API.

## Features

- **Random Recipe Discovery**: Get inspired with random meal suggestions on app startup
- **Advanced Recipe Search**: Search for recipes by name or ingredient with Enter key support
- **Smart Favorites Management**: Save and organize your favorite recipes with intelligent caching
- **Detailed Recipe View**: View complete recipes with ingredients, measurements, and instructions
- **Expandable Favorites Section**: Toggle between collapsed and expanded view of favorite meals
- **Custom Scrollbar Behavior**: Hidden scrollbars that appear on hover for better UX
- **Mobile-First Design**: Optimized for all devices with responsive design
- **Persistent Storage**: Your favorites and UI state persist between sessions
- **Performance Optimization**: Efficient caching and asynchronous loading

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS variables, flexbox, and custom scrollbars
- **Vanilla JavaScript (ES6+)**: Functional programming with factory functions, async/await, and Map for caching
- **Font Awesome**: Beautiful icons for UI elements
- **Google Fonts**: Poppins font family for modern typography
- **TheMealDB API**: Comprehensive recipe data source
- **localStorage**: Client-side data persistence

## Architecture

The application uses a **functional programming approach** with factory functions instead of classes:

### Core Modules

- **`createAPIService()`**: Handles all API communications with error handling
- **`createStorageService()`**: Manages localStorage operations with safe JSON parsing
- **`createCacheManager()`**: Implements intelligent caching using JavaScript Map
- **`createUIManager()`**: Controls all DOM manipulations and UI interactions
- **`createRecipeApp()`**: Main application orchestrator

### Key Features

- **Error Handling**: Comprehensive try-catch blocks and graceful degradation
- **Performance Optimization**: Async loading with Promise.all for favorites
- **Smart Caching**: Reduces API calls by caching meal data
- **State Management**: Persistent UI state (expanded/collapsed favorites)
- **Responsive Scrollbars**: Hidden by default, visible on hover (desktop only)

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AndyDrewDev/recipe-app.git
cd recipe-app
```

2. Open `index.html` in your web browser:

```bash
# Option 1: Double-click index.html
# Option 2: Use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000

# Or with Node.js
npx http-server
```

### Project Structure

```
recipe-app/
├── index.html          # Main HTML file with semantic structure
├── style.css           # Complete styling with responsive design
├── app.js             # Functional JavaScript architecture
└── README.md          # Project documentation
```

## Usage

1. **Discover Recipes**: The app loads with a random recipe on startup
2. **Search Recipes**:
   - Type in the search bar and click search button
   - Press Enter key for quick search
3. **Manage Favorites**:
   - Click the heart icon to add/remove favorites
   - Toggle favorites section by clicking the header
   - Hover over expanded favorites to see scrollbar
4. **View Recipe Details**: Click on any recipe card to see full details
5. **Navigate**: Click outside modal or use close button to return

## Features in Detail

### Recipe Discovery

- **Random Recipe Loading**: Fresh recipe suggestions on each app start
- **Search Functionality**: Real-time search through extensive meal database
- **Visual Feedback**: Loading states and error handling

### Smart Favorites System

- **LIFO Storage**: Latest favorites appear first
- **Intelligent Caching**: Reduces API calls for better performance
- **Persistent State**: Remembers expanded/collapsed preference
- **Quick Access**: One-click add/remove functionality

### Enhanced User Interface

- **Responsive Design**: Adapts perfectly to all screen sizes
- **Custom Scrollbars**:
  - Desktop: Hidden by default, appear on hover
  - Mobile: Always visible for touch interaction
- **Smooth Animations**: Transitions for all interactive elements
- **Accessibility**: Keyboard navigation and screen reader friendly

### Recipe Details Modal

- **Complete Information**: Full instructions and ingredient lists
- **High-Quality Images**: Beautiful meal photography
- **Flexible Ingredients**: Configurable ingredient count display
- **Easy Navigation**: Multiple ways to close modal

## API Integration

Utilizes [TheMealDB API](https://www.themealdb.com/api.php) endpoints:

- **Random Meal**: `www.themealdb.com/api/json/v1/1/random.php`
- **Search by Name**: `www.themealdb.com/api/json/v1/1/search.php?s={term}`
- **Lookup by ID**: `www.themealdb.com/api/json/v1/1/lookup.php?i={id}`

### Error Handling

- Network connectivity issues
- API rate limiting
- Malformed responses
- Missing recipe data

## Performance Features

- **Caching Strategy**: Map-based caching for frequently accessed meals
- **Async Loading**: Promise.all for concurrent API requests
- **Optimized Rendering**: Only re-render when data actually changes
- **Memory Management**: Automatic cache cleanup when favorites are empty

## Responsive Design

### Mobile (≤500px)

- Touch-optimized interface
- Simplified hover effects
- Always-visible scrollbars
- Compact layout

### Desktop (>500px)

- Enhanced hover interactions
- Hidden scrollbars (shown on hover)
- Larger touch targets
- Expanded layout options


## Code Quality Features

- **Functional Programming**: Pure functions and immutable data patterns
- **Error Boundaries**: Graceful error handling throughout the application
- **Type Safety**: Consistent data structures and validation
- **Code Organization**: Modular architecture with clear separation of concerns
- **Documentation**: Comprehensive inline comments
