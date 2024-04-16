// Check if the API is supported
if ('setAppBadge' in navigator) {
    navigator.setAppBadge(2).catch((error) => {
        // Code to handle an error
    });
}