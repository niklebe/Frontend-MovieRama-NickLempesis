// tests/nowPlayingMovies.spec.js
import { test, expect } from '@playwright/test'

const url = 'http://localhost:4173';

test('should display a list of now playing movies', async ({ page }) => {
    // Navigate to the MovieRama homepage
    await page.goto(url);

    // Wait for results
    await page.waitForTimeout(2000);

    const movies = await page.locator('.movie');
    await expect(movies).toHaveCount(20); // Assuming 20 movies are displayed initially

    // Validate that some essential data is displayed
    const firstMovieTitle = await movies.first().locator('.movie-title').innerText();
    const firstMovieRating = await movies.first().locator('.movie-rating-average').innerText();

    expect(firstMovieTitle).not.toBe('');
    expect(parseFloat(firstMovieRating)).toBeGreaterThan(0);
});

test('should load more movies as the user scrolls down', async ({ page }) => {
    // Navigate to the MovieRama homepage
    await page.goto(url);

    // Wait for results
    await page.waitForTimeout(2000);

    // Scroll to the bottom of the page to trigger infinite scrolling
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for results
    await page.waitForTimeout(2000);

    // Wait for the next batch of movies to load (e.g., page 2)
    const movies = await page.locator('.movie');
    await expect(movies).toHaveCount(40); // 20 + 20 from infinite scroll
});

test('should search for movies and display results', async ({ page }) => {
    // Navigate to the MovieRama homepage
    await page.goto(url);

    // Common query to yield multipage results
    const searchQuery = "King";

    // Type a movie title in the search box
    const searchInput = await page.locator('#movie-search input');
    await searchInput.fill(searchQuery);

    // Wait for results
    await page.waitForTimeout(2000);

    // Wait for search results to appear
    const searchResults = await page.locator('.movie');
    await searchResults.first().waitFor(); // Wait for at least one result to load

    // Validate that the search results contain the movie we searched for
    const firstSearchResultTitle = await searchResults.first().locator('.movie-title').innerText();
    expect(firstSearchResultTitle).toContain(searchQuery);
});

test('should load more search results as the user scrolls down', async ({ page }) => {
    // Navigate to the MovieRama homepage
    await page.goto(url);

    // Common query to yield multipage results
    const searchQuery = "King";

    // Type a movie title in the search box
    const searchInput = await page.locator('#movie-search input');
    await searchInput.fill(searchQuery);

    // Wait for results
    await page.waitForTimeout(2000);

    const searchResultsBeforeScroll = await page.locator('.movie').all();

    // Scroll to the bottom of the page to trigger infinite scrolling
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait for results
    await page.waitForTimeout(2000);

    // Wait for the next batch of movies to load (e.g., page 2) and compare numbers
    const searchResultsAfterScroll = await page.locator('.movie').all();
    await expect(searchResultsAfterScroll?.length).toBeGreaterThan(searchResultsBeforeScroll?.length);
});

test('should expand movie details when clicked', async ({ page }) => {
    // Navigate to the MovieRama homepage
    await page.goto(url);

    // Wait for the movie list to load
    const movie = await page.locator('.movie').first();
    await movie.waitFor(); // Ensure the movie card is available

    // Get locator movie element id
    const movieId = await movie.getAttribute('id');

    // Click on the movie to expand its details
    await movie.click();

    // Wait for the details section to expand
    await page.waitForSelector('.movie.active');

    // Check if the trailer, reviews, and similar movies are visible
    const trailer = await page.locator(`.movie-trailer`).first();
    const review = await page.locator(`.movie-review`).first();
    const similarMovie = await page.locator(`.similar-movie`).first();

    await expect(trailer).toBeVisible();
    await expect(review).toBeVisible();
    await expect(similarMovie).toBeVisible();
});

