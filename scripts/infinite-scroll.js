import { appendMovies } from "./movies";

const sentinel = document.getElementById("scroll-sentinel");
const sentinelSpinner = document.querySelector("#scroll-sentinel .spinner");
const sentinelMessage = document.querySelector("#scroll-sentinel p");

// generatorFunc: (page) => movie[]
export async function startMovieScrollObserver(generatorFunc) {
    try {
        const firstPage = await generatorFunc(1);
        if (firstPage?.results) appendMovies(firstPage.results);
        else return;

        let currentPage = 2;  // Start with the second page (first page is preloaded)
        let totalPages = firstPage?.total_pages || 1;   // Assume total number of pages in first result set.

        // Load more data when reaching the bottom
        async function loadMoreData() {
            sentinelSpinner.style.display = "block";

            // Fetch next page of data
            const data = await generatorFunc(currentPage);
            const movies = data?.results;

            if (!movies?.length) return;

            // Update totalPages dynamically if provided by the API
            totalPages = totalPages || data.total_pages;

            // Render new movies
            appendMovies(movies);

            // Move to the next page
            currentPage++;

            sentinelSpinner.style.display = "none";
        }

        // Intersection Observer callback
        const observerCallback = (entries) => {
            const [entry] = entries; // Take the first (and only) entry

            if (entry.isIntersecting && currentPage <= totalPages) {
                sentinelMessage.computedStyleMap.display = "hidden";

                loadMoreData();
            } else if (currentPage > totalPages) {
                sentinelMessage.computedStyleMap.display = "block";
            }
        };

        // Create an IntersectionObserver instance
        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '300px', // Optimistic observation to avoid flashes of content
            threshold: 0 // Trigger when the sentinel is fully visible
        };

        window.scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

        // Start observing the sentinel element
        window.scrollObserver.observe(sentinel);
    } catch (error) {
        console.error("Error registering scroll observer: ", error);
    }
}

