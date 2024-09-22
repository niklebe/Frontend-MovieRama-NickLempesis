import { startMovieScrollObserver } from "./infinite-scroll";
import { fetchNowPlaying, searchMovie } from "./movies";

function throttle(func, delay) {
    let timeout;
    return function (...args) {
        if (!timeout) {
            timeout = setTimeout(() => {
                func.apply(this, args); // Execute function after delay
                timeout = null; // Clear timeout to allow the next call
            }, delay);
        }
    };
}

const input = document.querySelector("#movie-search input");
const listTitle = document.getElementById("list-title");
const movieList = document.getElementById("movie-list");
const eraseButton = document.querySelector(".erase-button");
const searchButton = document.querySelector(".search-button");

export function registerSearchListener() {
    try {
        // Throttle callback for better performance
        const searchCallback = throttle(async () => {
            // Reset to Now Playing on empty search
            if (!input.value) {
                eraseButton.style.display = "none";
                searchButton.style.display = "block";
                listTitle.textContent = "Now In Theaters";
                movieList.textContent = '' // Faster than .innerHTML because HTML parser will not be invoked
                window.scrollObserver?.disconnect(); // Global scroll observer variable
                window.scrollObserver = null;
                // Register Now Playing observer
                const generatorFunc = fetchNowPlaying
                startMovieScrollObserver(generatorFunc);
                return
            }

            eraseButton.style.display = "block";
            searchButton.style.display = "none";

            // If some brief value we skip processing search because of poor results and for performance
            if (input.value.length < 3) return

            // Else, for meaningful search terms, define result generator function for current search term
            listTitle.textContent = "Search Results";
            movieList.textContent = ''
            window.scrollObserver?.disconnect();
            window.scrollObserver = null;
            const generatorFunc = (page) => searchMovie(input.value, page);
            startMovieScrollObserver(generatorFunc);
        }, 300);

        input.addEventListener("input", searchCallback)
    } catch (error) {
        console.error("Error registering search listener: ", error)
    }
}

window.eraseSearch = function () {
    input.value = ''
    const event = new CustomEvent('input');
    input.dispatchEvent(event)
    scrollTo({ top: 0, behavior: 'smooth' });
}
