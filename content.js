console.log('Script is running.');
//totaly ot ai genrated (:
// Extract video ID from the URL
function getVideoIDFromURL(url) {
  const params = new URLSearchParams(url.search);
  return params.get('v');
}

// Replace the video player with a custom iframe
function replaceVideoPlayer() {
  // Get the current video URL
  const currentURL = new URL(window.location.href);

  // Extract the video ID from the URL
  const videoID = getVideoIDFromURL(currentURL);
  console.log('Video ID:', videoID);

  // Check if a video ID is present
  if (videoID) {
    // Construct the YouTube URL with autoplay enabled and other controls disabled
    const youtubeURL = `https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0`;

    // Create an iframe element
    const customIframe = document.createElement('iframe');
    customIframe.src = youtubeURL;
    customIframe.style.width = '100%';
    customIframe.style.height = '100%';
    customIframe.style.border = 'none';

    // Create a MutationObserver instance
    const observer = new MutationObserver((mutationsList, observer) => {
      console.log('MutationObserver triggered.');
      // Look through all mutations that just occured
      for(let mutation of mutationsList) {
        // If the addedNodes property has one or more nodes
        if(mutation.addedNodes.length) {
          const videoPlayer = document.querySelector('div#movie_player');
          if (videoPlayer) {
            console.log('YouTube video player found!');
            // Pause the original YouTube player
            const ytPlayer = document.querySelector('video');
            if (ytPlayer) {
              ytPlayer.pause();
            }
            // Replace the YouTube video player with the custom iframe
            videoPlayer.innerHTML = '';
            videoPlayer.appendChild(customIframe);
            // Stop observing once the YouTube video player is found
            observer.disconnect();
          }
        }
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document, { childList: true, subtree: true });
  }
}

// Execute the replacement when the page is loaded
replaceVideoPlayer();

// Create a MutationObserver to watch for changes to the canonical link
const urlObserver = new MutationObserver((mutationsList, observer) => {
  for(let mutation of mutationsList) {
    if(mutation.type === 'attributes' && mutation.attributeName === 'href') {
      console.log('Canonical URL changed.');
      // Reload the page
      location.reload();
    }
  }
});

// Get the canonical link element
const canonicalLink = document.querySelector('link[rel="canonical"]');

// Start observing the canonical link for attribute changes
urlObserver.observe(canonicalLink, { attributes: true });

// Check the URL of the current page every 100 milliseconds (10 times per second), and log any changes to the console
let currentPage = window.location.href;  // Store the current page URL

setInterval(() => {  // Set up a function to run every 100ms
    let activePage = window.location.href;  // Get the current active page URL
    if (activePage !== currentPage) {  // If the active page URL is not the same as the stored URL
        console.log(`Page URL has changed to: ${activePage}`);  // Log the new URL to the console
        currentPage = activePage;  // Update the stored URL
        // Reload the page
        location.reload();
    }
}, 100);  // Run this check every 100ms
