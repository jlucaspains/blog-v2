const url = window.location.href;
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const referrer = document.referrer;
const loadDateTime = new Date();
let pageViewId = "";

addEventListener("beforeunload", (event) => {
    if (pageViewId === "") {
        return;
    }

    const unloadDateTime = new Date();
    const diffMilliseconds = Math.abs(unloadDateTime - loadDateTime);
    const diffSeconds = Math.round(diffMilliseconds / 1000);
    const pageViewDurationData = {
        id: pageViewId,
        durationSeconds: diffSeconds,
        timestamp: unloadDateTime.toISOString()
    };
    fetch('https://sharp-web-insights.azurewebsites.net/api/VovhZggVR6/pageViewDuration', {
        method: 'POST',
        body: JSON.stringify(pageViewDurationData),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            return response.text();
        })
        .then(data => {
            pageViewId = data; // Store the page view ID for later use
        })
        .catch(error => {
            console.error('Error sending page view duration data:', error);
        });
})

const pageViewData = {
    url,
    timeZone,
    timestamp: loadDateTime.toISOString(),
    referrer
};
fetch('https://sharp-web-insights.azurewebsites.net/api/VovhZggVR6/pageview', {
    method: 'POST',
    body: JSON.stringify(pageViewData),
    headers: { 'Content-Type': 'application/json' }
})
    .then(response => {
        return response.text();
    })
    .then(data => {
        pageViewId = data; // Store the page view ID for later use
    })
    .catch(error => {
        console.error('Error sending page view data:', error);
    });
