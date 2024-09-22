import { createIcons, X } from 'lucide';
import { registerSearchListener } from './search';
import { fetchNowPlaying } from './movies';
import { startMovieScrollObserver } from './infinite-scroll';

createIcons({
    icons: {
        X
    }
});

// Global variables

window.scrollObserver = null; // Global observer to be able to disconnect and garbage collect

// Register mount and unmount of scroll observer for new searches
registerSearchListener();

// Default list mode is Now Playing
startMovieScrollObserver(fetchNowPlaying);
