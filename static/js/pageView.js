import map from './timezones.js'

let userCountry;
let userTimeZone;

if (Intl) {
  userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  userCountry = map.get(userTimeZone);
}

console.log("Time Zone:", userTimeZone);
console.log("Country:", userCountry);
console.log("Page:", window.location.pathname);
console.log("Language:", navigator.language);