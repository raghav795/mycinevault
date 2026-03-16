// MyCineVault - Main Application Logic

// State
let movies = { watchlist: [], watched: [] };
let currentTab = 'watchlist';
let currentRating = 0;
let moveRating = 0;

// DOM Elements
const moviesGrid = document.getElementById('movies-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const filterLanguage = document.getElementById('filter-language');
const filterGenre = document.getElementById('filter-genre');
const filterRating = document.getElementById('filter-rating');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadMovies();
  setupEventListeners();
  switchTab('watchlist');
});

// Event Listeners
function setupEventListeners() {
  searchInput.addEventListener('input', renderMovies);
  filterLanguage.addEventListener('change', renderMovies);
  filterGenre.addEventListener('change', renderMovies);
  filterRating.addEventListener('change', renderMovies);
  
  // Status toggle in modal
  document.querySelectorAll('input[name="movie-status"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const ratingSection = document.getElementById('rating-section');
      if (e.target.value === 'watched') {
        ratingSection.classList.remove('hidden');
      } else {
        ratingSection.classList.add('hidden');
      }
    });
  });
  
  // Close modals on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMoveModal();
      closeDeleteModal();
    }
  });
  
  // Close modals on backdrop click
  document.getElementById('movie-modal').addEventListener('click', (e) => {
    if (e.target.id === 'movie-modal') closeModal();
  });
  document.getElementById('move-modal').addEventListener('click', (e) => {
    if (e.target.id === 'move-modal') closeMoveModal();
  });
  document.getElementById('delete-modal').addEventListener('click', (e) => {
    if (e.target.id === 'delete-modal') closeDeleteModal();
  });
}

// Local Storage
function loadMovies() {
  const saved = localStorage.getItem('mycinevault-movies');
  if (saved) {
    movies = JSON.parse(saved);
  }
  updateCounts();
  updateFilters();
}

function saveMovies() {
  localStorage.setItem('mycinevault-movies', JSON.stringify(movies));
  updateCounts();
  updateFilters();
}

// Tab Switching
function switchTab(tab) {
  currentTab = tab;
  
  // Update tab styles
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('text-primary-400', 'border-primary-400');
    btn.classList.add('text-dark-400', 'border-transparent');
  });
  
  const activeTab = document.getElementById(`tab-${tab}`);
  activeTab.classList.remove('text-dark-400', 'border-transparent');
  activeTab.classList.add('text-primary-400', 'border-primary-400');
  
  // Show/hide rating filter
  filterRating.classList.toggle('hidden', tab !== 'watched');
  
  renderMovies();
}

// Update counts
function updateCounts() {
  document.getElementById('watchlist-count').textContent = movies.watchlist.length;
  document.getElementById('watched-count').textContent = movies.watched.length;
}

// Update filter dropdowns
function updateFilters() {
  // Get unique languages from all movies
  const allMovies = [...movies.watchlist, ...movies.watched];
  const languages = [...new Set(allMovies.map(m => m.language).filter(Boolean))].sort();
  const genres = [...new Set(allMovies.map(m => m.genre).filter(Boolean))].sort();
  
  // Update language filter
  const currentLang = filterLanguage.value;
  filterLanguage.innerHTML = '<option value="">All Languages</option>';
  languages.forEach(lang => {
    filterLanguage.innerHTML += `<option value="${lang}">${lang}</option>`;
  });
  filterLanguage.value = currentLang;
  
  // Update genre filter
  const currentGenre = filterGenre.value;
  filterGenre.innerHTML = '<option value="">All Genres</option>';
  genres.forEach(genre => {
    filterGenre.innerHTML += `<option value="${genre}">${genre}</option>`;
  });
  filterGenre.value = currentGenre;
}

// Render Movies
function renderMovies() {
  const list = movies[currentTab];
  const searchTerm = searchInput.value.toLowerCase();
  const langFilter = filterLanguage.value;
  const genreFilter = filterGenre.value;
  const ratingFilter = parseInt(filterRating.value) || 0;
  
  // Filter movies
  const filtered = list.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm) ||
      (movie.director && movie.director.toLowerCase().includes(searchTerm)) ||
      (movie.actors && movie.actors.toLowerCase().includes(searchTerm));
    const matchesLang = !langFilter || movie.language === langFilter;
    const matchesGenre = !genreFilter || movie.genre === genreFilter;
    const matchesRating = !ratingFilter || (movie.rating && movie.rating >= ratingFilter);
    
    return matchesSearch && matchesLang && matchesGenre && matchesRating;
  });
  
  // Show empty state or grid
  if (filtered.length === 0) {
    moviesGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    
    const emptyTitle = document.getElementById('empty-title');
    const emptySubtitle = document.getElementById('empty-subtitle');
    
    if (list.length === 0) {
      emptyTitle.textContent = currentTab === 'watchlist' 
        ? 'Your watchlist is empty' 
        : 'No watched movies yet';
      emptySubtitle.textContent = currentTab === 'watchlist'
        ? 'Add movies you want to watch'
        : 'Move movies from your watchlist once you watch them';
    } else {
      emptyTitle.textContent = 'No matches found';
      emptySubtitle.textContent = 'Try adjusting your search or filters';
    }
  } else {
    moviesGrid.classList.remove('hidden');
    emptyState.classList.add('hidden');
    
    moviesGrid.innerHTML = filtered.map((movie, index) => createMovieCard(movie, index)).join('');
  }
}

// Create Movie Card HTML
function createMovieCard(movie, index) {
  const stars = movie.rating 
    ? '⭐'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating)
    : '';
  
  const dateStr = new Date(movie.dateAdded).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  return `
    <div class="movie-card bg-dark-800 rounded-xl border border-dark-700 overflow-hidden animate-slide-up" style="animation-delay: ${index * 50}ms">
      <div class="p-5">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-bold text-white leading-tight pr-2">${escapeHtml(movie.title)}</h3>
          <div class="flex gap-1 flex-shrink-0">
            <button onclick="openEditModal('${movie.id}')" class="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
            </button>
            <button onclick="openDeleteModal('${movie.id}')" class="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-all" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-600/20 text-purple-400 border border-purple-500/30">
            🌐 ${escapeHtml(movie.language)}
          </span>
          ${movie.genre ? `
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-500/30">
              🎬 ${escapeHtml(movie.genre)}
            </span>
          ` : ''}
        </div>
        
        ${movie.rating ? `
          <div class="flex items-center gap-1 mb-3">
            <span class="text-lg">${stars}</span>
            <span class="text-sm text-dark-400">(${movie.rating}/5)</span>
          </div>
        ` : ''}
        
        ${movie.director ? `
          <p class="text-sm text-dark-400 mb-1">
            <span class="text-dark-500">Director:</span> ${escapeHtml(movie.director)}
          </p>
        ` : ''}
        
        ${movie.actors ? `
          <p class="text-sm text-dark-400 mb-1">
            <span class="text-dark-500">Cast:</span> ${escapeHtml(movie.actors)}
          </p>
        ` : ''}
        
        ${movie.notes ? `
          <p class="text-sm text-dark-400 mt-3 p-3 bg-dark-900/50 rounded-lg border border-dark-700">
            "${escapeHtml(movie.notes)}"
          </p>
        ` : ''}
        
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-dark-700">
          <span class="text-xs text-dark-500">Added ${dateStr}</span>
          
          ${currentTab === 'watchlist' ? `
            <button onclick="openMoveModal('${movie.id}')" class="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm font-medium rounded-lg transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Watched
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Modal Functions
function openAddModal() {
  document.getElementById('modal-title').textContent = 'Add Movie';
  document.getElementById('movie-form').reset();
  document.getElementById('movie-id').value = '';
  document.getElementById('rating-section').classList.add('hidden');
  currentRating = 0;
  updateStarDisplay('rating-stars', 0);
  
  // Set default status based on current tab
  document.querySelector(`input[name="movie-status"][value="${currentTab}"]`).checked = true;
  if (currentTab === 'watched') {
    document.getElementById('rating-section').classList.remove('hidden');
  }
  
  document.getElementById('movie-modal').classList.remove('hidden');
  document.getElementById('movie-title').focus();
}

function openEditModal(id) {
  const movie = findMovie(id);
  if (!movie) return;
  
  document.getElementById('modal-title').textContent = 'Edit Movie';
  document.getElementById('movie-id').value = movie.id;
  document.getElementById('movie-title').value = movie.title;
  document.getElementById('movie-language').value = movie.language;
  document.getElementById('movie-genre').value = movie.genre || '';
  document.getElementById('movie-director').value = movie.director || '';
  document.getElementById('movie-actors').value = movie.actors || '';
  document.getElementById('movie-notes').value = movie.notes || '';
  
  const status = movies.watchlist.find(m => m.id === id) ? 'watchlist' : 'watched';
  document.querySelector(`input[name="movie-status"][value="${status}"]`).checked = true;
  
  if (status === 'watched') {
    document.getElementById('rating-section').classList.remove('hidden');
    currentRating = movie.rating || 0;
    updateStarDisplay('rating-stars', currentRating);
  } else {
    document.getElementById('rating-section').classList.add('hidden');
  }
  
  document.getElementById('movie-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('movie-modal').classList.add('hidden');
}

function openMoveModal(id) {
  const movie = movies.watchlist.find(m => m.id === id);
  if (!movie) return;
  
  document.getElementById('move-movie-id').value = id;
  document.getElementById('move-movie-title').textContent = movie.title;
  moveRating = 0;
  updateStarDisplay('move-rating-stars', 0);
  document.getElementById('move-modal').classList.remove('hidden');
}

function closeMoveModal() {
  document.getElementById('move-modal').classList.add('hidden');
}

function openDeleteModal(id) {
  const movie = findMovie(id);
  if (!movie) return;
  
  document.getElementById('delete-movie-id').value = id;
  document.getElementById('delete-movie-title').textContent = movie.title;
  document.getElementById('delete-modal').classList.remove('hidden');
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.add('hidden');
}

// Rating Functions
function setRating(rating) {
  currentRating = rating;
  document.getElementById('movie-rating').value = rating;
  updateStarDisplay('rating-stars', rating);
}

function setMoveRating(rating) {
  moveRating = rating;
  document.getElementById('move-rating').value = rating;
  updateStarDisplay('move-rating-stars', rating);
}

function updateStarDisplay(containerId, rating) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('button').forEach((btn, i) => {
    if (i < rating) {
      btn.textContent = '★';
      btn.classList.remove('text-dark-500');
      btn.classList.add('text-yellow-400');
    } else {
      btn.textContent = '☆';
      btn.classList.remove('text-yellow-400');
      btn.classList.add('text-dark-500');
    }
  });
}

// CRUD Operations
function saveMovie(event) {
  event.preventDefault();
  
  const id = document.getElementById('movie-id').value;
  const title = document.getElementById('movie-title').value.trim();
  const language = document.getElementById('movie-language').value;
  const genre = document.getElementById('movie-genre').value;
  const director = document.getElementById('movie-director').value.trim();
  const actors = document.getElementById('movie-actors').value.trim();
  const notes = document.getElementById('movie-notes').value.trim();
  const status = document.querySelector('input[name="movie-status"]:checked').value;
  const rating = status === 'watched' ? currentRating : 0;
  
  if (!title || !language) {
    showToast('Please fill in required fields');
    return;
  }
  
  if (id) {
    // Edit existing movie
    const existingInWatchlist = movies.watchlist.findIndex(m => m.id === id);
    const existingInWatched = movies.watched.findIndex(m => m.id === id);
    
    const updatedMovie = {
      id,
      title,
      language,
      genre,
      director,
      actors,
      notes,
      rating,
      dateAdded: findMovie(id).dateAdded,
      dateWatched: status === 'watched' ? (findMovie(id).dateWatched || new Date().toISOString()) : null
    };
    
    // Remove from old location
    if (existingInWatchlist !== -1) movies.watchlist.splice(existingInWatchlist, 1);
    if (existingInWatched !== -1) movies.watched.splice(existingInWatched, 1);
    
    // Add to new location
    movies[status].unshift(updatedMovie);
    
    showToast('Movie updated!');
  } else {
    // Add new movie
    const newMovie = {
      id: generateId(),
      title,
      language,
      genre,
      director,
      actors,
      notes,
      rating,
      dateAdded: new Date().toISOString(),
      dateWatched: status === 'watched' ? new Date().toISOString() : null
    };
    
    movies[status].unshift(newMovie);
    showToast(`Added to ${status}!`);
  }
  
  saveMovies();
  closeModal();
  renderMovies();
}

function confirmMoveToWatched() {
  const id = document.getElementById('move-movie-id').value;
  const movieIndex = movies.watchlist.findIndex(m => m.id === id);
  
  if (movieIndex === -1) return;
  
  const movie = movies.watchlist[movieIndex];
  movie.rating = moveRating;
  movie.dateWatched = new Date().toISOString();
  
  movies.watchlist.splice(movieIndex, 1);
  movies.watched.unshift(movie);
  
  saveMovies();
  closeMoveModal();
  renderMovies();
  showToast('Moved to watched!');
}

function confirmDelete() {
  const id = document.getElementById('delete-movie-id').value;
  
  movies.watchlist = movies.watchlist.filter(m => m.id !== id);
  movies.watched = movies.watched.filter(m => m.id !== id);
  
  saveMovies();
  closeDeleteModal();
  renderMovies();
  showToast('Movie deleted');
}

// Helper Functions
function findMovie(id) {
  return movies.watchlist.find(m => m.id === id) || movies.watched.find(m => m.id === id);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 2500);
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}
