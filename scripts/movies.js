// Performance: The use of DocumentFragment reduces the number of direct DOM manipulations, which can improve performance when rendering many elements.
// Separation of Concerns: The <template> element helps to keep your HTML structure separate from your JavaScript logic, making the code more modular and maintainable.
// Reusability: The template can be reused multiple times, and it's easy to update or modify in the future.

import { iframeElement, notFoundElement, sleep, stopAllYouTubeVideos } from "./utils";

const movieList = document.getElementById("movie-list");
// Create a document fragment (once) for preformance. Fewer DOM manipulations. This gets emptied when contents are appended to DOM.
const moviesFragment = document.createDocumentFragment();
const movieReviewsFragment = document.createDocumentFragment();
const movieSimilarFragment = document.createDocumentFragment();
const movieGenresFragment = document.createDocumentFragment();
const movieTemplate = document.getElementById("movie-template");
const movieReviewTemplate = document.getElementById("movie-review-template");
const movieSimilarTemplate = document.getElementById("movie-similar-template");
const movieGenreTemplate = document.getElementById("movie-genre-template");

async function fetchTMDB(endpoint, queryParams) {
    try {
        const query = new URLSearchParams({
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            ...queryParams
        });
        const url = `https://api.themoviedb.org/3${endpoint}?${query}`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        return json
    } catch (error) {
        console.error("Error querrying movie API at " + endpoint + ": " + error)
        throw error;
    }
}

export async function fetchNowPlaying(page) {
    try {
        return await fetchTMDB(`/movie/now_playing`, { page });
    } catch (error) {
        console.error("Error fetching now playing movies:", error);
        return null;
    }
}

export async function fetchMovie(id) {
    try {
        return await fetchTMDB(`/movie/${id}`);
    } catch (error) {
        console.error("Error fetching movie details:", error);
        return null;
    }
}

export async function fetchMovieVideos(id) {
    try {
        return await fetchTMDB(`/movie/${id}/videos`);
    } catch (error) {
        console.error("Error fetching movie videos:", error);
        return null;
    }
}

export async function fetchMovieReviews(id) {
    try {
        return await fetchTMDB(`/movie/${id}/reviews`);
    } catch (error) {
        console.error("Error fetching movie reviews:", error);
        return null;
    }
}

export async function fetchMovieSimilar(id) {
    try {
        return await fetchTMDB(`/movie/${id}/similar`);
    } catch (error) {
        console.error("Error fetching similar movies:", error);
        return null;
    }
}

export async function fetchGenres() {
    try {
        const response = await fetchTMDB(`/genre/movie/list`);
        return response?.genres;
    } catch (error) {
        console.error("Error fetching genres:", error);
        return null;
    }
}

export async function searchMovie(query, page) {
    try {
        return await fetchTMDB(`/search/movie`, { query: encodeURIComponent(query), page });
    } catch (error) {
        console.error("Error searching movies:", error);
        return null;
    }
}

async function loadMovieTrailer(id) {
    try {
        const section = document.getElementById(id)?.querySelector('.movie-trailer-section');
        const skeletons = document.getElementById(id)?.querySelectorAll('.movie-trailer-section .skeleton');
        if (!skeletons?.length) return;

        const videos = (await fetchMovieVideos(id))?.results;
        const video = videos?.find(v => v.site == 'YouTube' && v.type == 'Trailer');

        skeletons.forEach(s => { s.remove() });
        if (!video) {
            section?.appendChild(notFoundElement())
        } else {
            // ?enablejsapi=1 is necessary to control video playback programmatically
            section?.appendChild(iframeElement(`https://www.youtube.com/embed/${video.key}?enablejsapi=1`, video.name, 'movie-trailer'));
        }
    } catch (error) {
        console.error("Error loading movie trailer:", error);
        // Handle error appropriately
    }
}
async function loadMovieReviews(id) {
    try {
        const section = document.getElementById(id)?.querySelector('.movie-reviews-section');
        const skeletons = document.getElementById(id)?.querySelectorAll('.movie-reviews-section .skeleton');
        if (!skeletons?.length) return;

        const reviews = (await fetchMovieReviews(id))?.results?.slice(0, 3);

        skeletons.forEach(s => { s.remove() });
        if (!reviews?.length) {
            section?.appendChild(notFoundElement())
        } else {
            reviews.forEach(review => {
                const movieReviewClone = movieReviewTemplate.content.cloneNode(true);
                movieReviewClone.querySelector(".review-quote").innerHTML = review?.content;
                movieReviewClone.querySelector(".review-rating-score").textContent = review?.author_details?.rating;
                movieReviewClone.querySelector(".review-author").textContent = review?.author_details?.name;
                movieReviewsFragment.appendChild(movieReviewClone)
            })

            section?.appendChild(movieReviewsFragment);
            const quotes = section.querySelectorAll(".review-quote");
            quotes?.forEach(quote => {
                quote.addEventListener("click", (event) => {
                    event.stopPropagation()
                    quote.classList.toggle('active');
                })
            })
        }
    } catch (error) {
        console.error("Error loading movie reviews:", error);
        // Handle error appropriately
    }
}
async function loadMovieSimilar(id) {
    try {
        const section = document.getElementById(id)?.querySelector('.movie-similar-section .similar-movies');
        const skeletons = document.getElementById(id)?.querySelectorAll('.movie-similar-section .skeleton');
        if (!skeletons?.length) return;

        const similar = (await fetchMovieSimilar(id))?.results?.slice(0, 3);

        skeletons.forEach(s => { s.remove() });
        if (!similar?.length) {
            section?.appendChild(notFoundElement())
        } else {
            similar.forEach(movie => {
                const movieSimilarClone = movieSimilarTemplate.content.cloneNode(true);
                movieSimilarClone.querySelector("img").src = `https://media.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.poster_path}`;
                movieSimilarClone.querySelector("img").alt = movie.title;
                // movieSimilarClone.querySelector(".movie-similar-title").textContent = movie.title;
                movieSimilarFragment.appendChild(movieSimilarClone)
            })

            section?.appendChild(movieSimilarFragment);
        }
    } catch (error) {
        console.error("Error loading similar movies:", error);
        // Handle error appropriately
    }
}
// FLIP method animation
export function registerMoviesClickListener(movieIds) {
    try {
        if (!movieIds?.length) return;

        const allMountedMovies = document.querySelectorAll('.movie');
        if (!allMountedMovies?.length) return;

        Array.from(allMountedMovies)
            // Register listener only for this batch of elements
            ?.filter(item => {
                const movieId = Number(item.id);
                return movieIds.includes(movieId)
            })
            ?.forEach(item => {
                item.addEventListener('click', async function (event) {
                    event.stopPropagation();

                    const movieId = item.id;

                    // First: Get the initial positions and sizes of all grid items
                    const firstPositions = [];
                    document.querySelectorAll('.movie').forEach(item => {
                        const rect = item.getBoundingClientRect();
                        firstPositions.push({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                    });

                    // Toggle "active" class (expands or shrinks the clicked item)
                    const isActive = item.classList.contains('active');

                    // Load movie details independently from one-another
                    if (!isActive) {
                        loadMovieTrailer(movieId);
                        loadMovieReviews(movieId);
                        loadMovieSimilar(movieId);
                    }

                    // Stop video playback on any click
                    stopAllYouTubeVideos();

                    // Remove active from all cards
                    document.querySelectorAll('.movie').forEach(item => item.classList.remove('active'));
                    if (!isActive) item.classList.add('active');

                    // Last: Get the new positions and sizes after the change
                    const lastPositions = [];
                    document.querySelectorAll('.movie').forEach(item => {
                        const rect = item.getBoundingClientRect();
                        lastPositions.push({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
                    });

                    // Invert: Calculate the position and size differences, and apply them
                    document.querySelectorAll('.movie').forEach((item, index) => {
                        const first = firstPositions[index];
                        const last = lastPositions[index];

                        const deltaX = first.left - last.left;
                        const deltaY = first.top - last.top;
                        const scaleX = first.width / last.width;
                        const scaleY = first.height / last.height;

                        // Apply translation and scaling to invert the changes
                        item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
                        item.style.transition = 'transform 0s'; // Instantly apply the transformation
                    });

                    // Play: Animate everything to its final state
                    requestAnimationFrame(() => {
                        document.querySelectorAll('.movie').forEach(item => {
                            item.style.transform = ''; // Clear the transform to play the animation
                            item.style.transition = 'transform 0.3s ease'; // Smooth transition
                        });
                    });
                });
            });
    } catch (error) {
        console.error("Error registering movie click listeners:", error);
        // Handle error appropriately
    }
}
export async function appendMovies(movies) {
    try {
        if (!movies?.length) return;
        let genres = await fetchGenres();

        movies.forEach(movie => {
            const movieClone = movieTemplate.content.cloneNode(true);
            movieClone.querySelector(".movie").id = movie.id;
            movieClone.querySelector(".movie-title").textContent = movie.title;
            movieClone.querySelector(".movie-overview").textContent = movie.overview;
            if (movie?.backdrop_path) movieClone.querySelector(".movie-poster").src = `https://media.themoviedb.org/t/p/w300_and_h450_bestv2/${movie.backdrop_path}`;
            else movieClone.querySelector(".movie-poster").remove()
            if (movie.vote_average) movieClone.querySelector(".movie-rating-average").textContent = (Math.round(movie.vote_average * 10) / 10).toFixed(1);
            else movieClone.querySelector(".movie-rating").remove()
            movieClone.querySelector(".movie-year").textContent = (new Date(movie.release_date)).getFullYear();

            // movieClone.querySelector(".movie-trailer-section iframe").src = `https://www.youtube.com/embed/${movie.trailer}`;

            // Look up genres by id and add genre names to card
            if (genres?.length && movie.genre_ids?.length) {
                movie.genre_ids.slice(0, 3).forEach(genreId => {
                    const movieGenreClone = movieGenreTemplate.content.cloneNode(true);
                    movieGenreClone.querySelector(".movie-genre").textContent = genres?.find(g => g.id == genreId)?.name || "";
                    movieGenresFragment.appendChild(movieGenreClone)
                })
            }
            movieClone.querySelector(".movie-genres").appendChild(movieGenresFragment)

            moviesFragment.appendChild(movieClone); // Append each movie div to the fragment
        });

        movieList.appendChild(moviesFragment); // Append the fragment to the DOM in one operation
        registerMoviesClickListener(movies.map(movie => movie.id)) // Register click listeners for batch
    } catch (error) {
        console.error("Error appending movies:", error);
        // Handle error appropriately
    }
}
