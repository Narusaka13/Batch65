// navigation.js

function navigateTo(page) {
  // Map pages URLs
  const pages = {
    home: "homepage.html",
    projects: "MyProjectpage.html",
    contact: "Contactpage.html",
  };
  // Go to the page
  window.location.href = pages[page] || "HomePage.html";
}
