# Recipe App

A modern, responsive web application for discovering and managing your favorite recipes. Built with vanilla JavaScript and powered by TheMealDB API.

## Features

- **Random Recipe Discovery**: Get inspired with random meal suggestions
- **Recipe Search**: Search for recipes by name or ingredient
- **Favorites Management**: Save and organize your favorite recipes locally
- **Detailed Recipe View**: View complete recipes with ingredients and instructions
- **Mobile-First Design**: Optimized for all devices with responsive design
- **Local Storage**: Your favorites persist between sessions

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS variables and flexbox
- **Vanilla JavaScript**: ES6+ features and async/await
- **Font Awesome**: Beautiful icons
- **Google Fonts**: Poppins font family
- **TheMealDB API**: Recipe data source

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for API calls

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AndyDrewDev/Recipe-App.git
cd recipe-app
```

2. Open `index.html` in your web browser:

```bash
# Option 1: Double-click index.html
# Option 2: Use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Project Structure

```
recipe-app/
├── index.html          # Main HTML file
├── style.css           # Styling and responsive design
├── app.js             # JavaScript functionality
└── README.md          # Project documentation
```

## Usage

1. **Discover Recipes**: The app loads with a random recipe on startup
2. **Search**: Use the search bar to find specific recipes
3. **Add to Favorites**: Click the heart icon to save recipes
4. **View Details**: Click on any recipe card to see full details
5. **Manage Favorites**: View and remove favorites from the top section

## Features in Detail

### Recipe Cards

- Beautiful card design with meal images
- Heart button for favorites
- Hover effects and smooth transitions

### Search Functionality

- Real-time search through TheMealDB API
- Search by meal name or ingredients
- Instant results display

### Favorites System

- Local storage persistence
- Quick access to saved recipes
- Easy removal with one click

### Recipe Details Modal

- Full recipe instructions
- Complete ingredients list with measurements
- High-quality meal images

## API Integration

This app uses [TheMealDB API](https://www.themealdb.com/api.php) which provides:

- Random meal endpoint
- Search by name endpoint
- Meal details by ID endpoint

## Responsive Design

- Mobile-first approach
- Optimized for screens from 320px to desktop
- Touch-friendly interface
- Smooth animations and transitions

## Design Features

- Modern gradient backgrounds
- Card-based layout
- Consistent color scheme with CSS variables
- Smooth hover effects and transitions
- Clean typography with Poppins font

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers
