const POSTER_PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27360%27 height=%27540%27%3E%3Crect width=%27360%27 height=%27540%27 fill=%27%23333333%27 /%3E%3Ctext x=%2750%25%27 y=%2750%25%27 dominant-baseline=%27middle%27 text-anchor=%27middle%27 fill=%27%23cccccc%27 font-family=%27Arial%2C sans-serif%27 font-size=%2724%27%3ENo poster%3C/text%3E%3C/svg%3E';
const defaultMovies = [
  { id: '1', title: 'The Midnight Sky', year: 2024, genre: 'Sci-Fi', imdb: 'https://www.imdb.com/title/tt10539608/', poster: POSTER_PLACEHOLDER },
  { id: '2', title: 'Dune: Part Two', year: 2024, genre: 'Adventure', imdb: 'https://www.imdb.com/title/tt15239678/', poster: POSTER_PLACEHOLDER },
  { id: '3', title: 'A Quiet Place: Day One', year: 2024, genre: 'Horror', imdb: 'https://www.imdb.com/title/tt12259788/', poster: POSTER_PLACEHOLDER },
  { id: '4', title: 'Wonka', year: 2024, genre: 'Fantasy', imdb: 'https://www.imdb.com/title/tt3117704/', poster: POSTER_PLACEHOLDER },
  { id: '5', title: 'Mission: Impossible - Dead Reckoning', year: 2024, genre: 'Action', imdb: 'https://www.imdb.com/title/tt9603212/', poster: POSTER_PLACEHOLDER },
  { id: '6', title: 'Barbie', year: 2024, genre: 'Comedy', imdb: 'https://www.imdb.com/title/tt1517268/', poster: POSTER_PLACEHOLDER },
  { id: '7', title: 'Oppenheimer', year: 2024, genre: 'Drama', imdb: 'https://www.imdb.com/title/tt15398776/', poster: POSTER_PLACEHOLDER },
  { id: '8', title: 'Spider-Man: Across the Spider-Verse', year: 2024, genre: 'Animation', imdb: 'https://www.imdb.com/title/tt9362722/', poster: POSTER_PLACEHOLDER },
  { id: '9', title: 'Indiana Jones and the Dial of Destiny', year: 2024, genre: 'Adventure', imdb: 'https://www.imdb.com/title/tt1462764/', poster: POSTER_PLACEHOLDER },
  { id: '10', title: 'The Batman', year: 2024, genre: 'Crime', imdb: 'https://www.imdb.com/title/tt1877830/', poster: POSTER_PLACEHOLDER }
];

const wishlistKey = 'sahai_movie_world_wishlist';

function getWishlist() {
  const saved = localStorage.getItem(wishlistKey);
  return saved ? JSON.parse(saved) : [];
}

function saveWishlist(list) {
  localStorage.setItem(wishlistKey, JSON.stringify(list));
}

function normalizeId(id) {
  return String(id);
}

function isMovieInWishlist(movieId) {
  const id = normalizeId(movieId);
  return getWishlist().some((item) => normalizeId(item.id) === id);
}

function addToWishlist(movie) {
  const wishlist = getWishlist();
  if (!isMovieInWishlist(movie.id)) {
    wishlist.push({ ...movie, id: normalizeId(movie.id) });
    saveWishlist(wishlist);
    alert(`Added "${movie.title}" to your wishlist.`);
    renderResults(currentResults);
  }
}

function removeFromWishlist(movieId) {
  const id = normalizeId(movieId);
  const wishlist = getWishlist().filter((item) => normalizeId(item.id) !== id);
  saveWishlist(wishlist);
  renderWishlist();
}

function setStatus(message) {
  const status = document.getElementById('statusMessage');
  if (!status) return;
  status.textContent = message;
  status.style.color = '#b0b0b0';
}

function getImdbUrl(imdbID) {
  return `https://www.imdb.com/title/${imdbID}/`;
}

function searchMovies(query) {
  if (!query) {
    return defaultMovies;
  }
  const lower = query.toLowerCase();
  const matches = defaultMovies.filter((movie) =>
    movie.title.toLowerCase().includes(lower) ||
    movie.genre.toLowerCase().includes(lower) ||
    String(movie.year).includes(lower)
  );
  return matches.length ? matches : defaultMovies;
}

function renderResults(results) {
  currentResults = results;
  const resultsGrid = document.getElementById('resultsGrid');
  if (!resultsGrid) return;

  resultsGrid.innerHTML = results.length
    ? results.map((movie) => {
        const saved = isMovieInWishlist(movie.id);
        return `
          <article class="card">
            <div class="card-cover">
              <img src="${movie.poster || POSTER_PLACEHOLDER}" alt="${movie.title} poster" />
            </div>
            <div class="card-content">
              <h3>${movie.title}</h3>
              <p><strong>Genre:</strong> ${movie.genre}</p>
              <p><strong>Year:</strong> ${movie.year}</p>
              <div class="card-actions">
                <a class="button outline" href="${movie.imdb}" target="_blank" rel="noopener noreferrer">IMDb</a>
                <button class="button" ${saved ? 'disabled' : ''} data-movie-id="${movie.id}">${saved ? 'Added' : 'Add to Wishlist'}</button>
              </div>
            </div>
          </article>
        `;
      }).join('')
    : '<p class="empty-state">No movies found. Try another search term.</p>';

  resultsGrid.querySelectorAll('button[data-movie-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.movieId;
      const movie = results.find((item) => normalizeId(item.id) === normalizeId(id));
      if (movie) {
        addToWishlist(movie);
        renderResults(results);
      }
    });
  });
}

function handleSearch() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim();
  const resultsGrid = document.getElementById('resultsGrid');
  if (!resultsGrid) return;

  const searchResults = searchMovies(query);
  setStatus(`Showing local sample movies for "${query || 'all'}".`);
  renderResults(searchResults);
}

function renderWishlist() {
  const wishlistGrid = document.getElementById('wishlistGrid');
  if (!wishlistGrid) return;
  const wishlist = getWishlist();
  wishlistGrid.innerHTML = wishlist.length
    ? wishlist.map((movie) => `
        <article class="card">
          <div class="card-cover">
            <img src="${movie.poster || POSTER_PLACEHOLDER}" alt="${movie.title} poster" />
          </div>
          <div class="card-content">
            <h3>${movie.title}</h3>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Year:</strong> ${movie.year}</p>
            <div class="card-actions">
              <a class="button outline" href="${movie.imdb}" target="_blank" rel="noopener noreferrer">IMDb</a>
              <button class="button" data-remove-id="${movie.id}">Remove</button>
            </div>
          </div>
        </article>
      `).join('')
    : '<p class="empty-state">Your wishlist is empty. Add a movie from the search page.</p>';

  wishlistGrid.querySelectorAll('button[data-remove-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.removeId;
      removeFromWishlist(id);
    });
  });
}

function initializePage() {
  if (document.getElementById('resultsGrid')) {
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    document.getElementById('searchInput').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleSearch();
    });
    renderResults(defaultMovies);
    setStatus('Enter a movie title and click Search. Showing sample movies.');
  }

  if (document.getElementById('wishlistGrid')) {
    document.getElementById('clearWishlist').addEventListener('click', () => {
      if (confirm('Clear all movies from your wishlist?')) {
        saveWishlist([]);
        renderWishlist();
      }
    });
    renderWishlist();
  }
}

let currentResults = defaultMovies;
initializePage();

