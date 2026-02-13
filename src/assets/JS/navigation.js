// LOGIC FOR navigation.js //
function navigateTo(page, projectId = null) {
  // Map pages URLs
  const pages = {
    home: "/",
    projects: "/projects",
    contact: "/contact",
    detail: "/detail",
  };
  // Go to the page with navigating to detail page
  if (page === "detail" && projectId) {
    window.location.href = `${pages.detail}/${projectId}`;
  } else {
    window.location.href = pages[page] || "/";
  }
}
