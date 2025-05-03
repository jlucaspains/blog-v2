const url = window.location.href;
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const referrer = document.referrer;
const pageViewData = {
    url,
    timeZone,
    timestamp: new Date().toISOString(),
    referrer
};
fetch('https://sharp-web-insights.azurewebsites.net/api/VovhZggVR6/pageview', {
    method: 'POST',
    body: JSON.stringify(pageViewData),
    headers: { 'Content-Type': 'application/json' }
}).catch(error => {
    console.error('Error sending page view data:', error);
});