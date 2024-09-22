import { expect, test } from 'vitest'
import { fetchMovieReviews, fetchMovieSimilar, fetchMovieVideos, fetchNowPlaying, searchMovie } from '../../scripts/movies';

test('should fetch the first page of now playing movies', async () => {
    const response = (await fetchNowPlaying(1));
    expect(response?.results?.length).toBeGreaterThan(5)
    expect(response?.results?.[Math.floor(Math.random() * 5)]).toHaveProperty("title").toHaveProperty("release_date")
    expect(response?.page).toBe(1);
    expect(response).toHaveProperty("total_pages");
});

test('should fetch the second page of now playing movies', async () => {
    const response = (await fetchNowPlaying(2));
    expect(response?.results?.length).toBeGreaterThan(5)
    expect(response?.results?.[Math.floor(Math.random() * 5)]).toHaveProperty("title").toHaveProperty("release_date")
    expect(response?.page).toBe(2);
    expect(response).toHaveProperty("total_pages");
});

test('should fetch searched movies based on query', async () => {
    const query = 'Godfather';
    const response = await searchMovie(query, 1);
    expect(response?.results?.length).toBeGreaterThan(5)
    expect(response?.results?.[Math.floor(Math.random() * 5)]).toHaveProperty("title").toHaveProperty("release_date")
    expect(response?.page).toBe(1);
    expect(response).toHaveProperty("total_pages");
});

test('should fetch movie reviews', async () => {
    const response = await fetchMovieReviews(957452);
    expect(response?.results?.length).toBeGreaterThan(2)
    expect(response?.results?.[Math.floor(Math.random() * 3)]).toHaveProperty("author_details").toHaveProperty("content")
    expect(response).toHaveProperty("page").toHaveProperty("total_pages");
});

test('should fetch movie videos', async () => {
    const response = await fetchMovieVideos(957452);
    expect(response?.results?.length).toBeGreaterThan(2)
    expect(response?.results?.[Math.floor(Math.random() * 3)]).toHaveProperty("key").toHaveProperty("type")
});

test('should fetch similar movies', async () => {
    const response = await fetchMovieSimilar(957452);
    expect(response?.results?.length).toBeGreaterThan(5)
    expect(response?.results?.[Math.floor(Math.random() * 5)]).toHaveProperty("title").toHaveProperty("release_date")
    expect(response?.page).toBe(1);
    expect(response).toHaveProperty("total_pages");
});