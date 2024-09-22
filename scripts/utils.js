export const sleep = ms => new Promise(r => setTimeout(r, ms));

export const notFoundElement = () => {
    const notFound = document.createElement("p");
    notFound.classList = 'text-muted text-sm';
    notFound.textContent = 'Not found.'
    return notFound;
}

export const iframeElement = (src, title, classList) => {
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = title;
    iframe.allowFullscreen = true;
    iframe.classList = classList;
    return iframe;
}

export const stopAllYouTubeVideos = () => {
    var iframes = document.querySelectorAll('iframe');
    Array.prototype.forEach.call(iframes, iframe => {
        iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'stopVideo'
        }), '*');
    });
}
