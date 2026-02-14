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
// function confirmDelete(projectId, projectName) {
//   if (confirm(`Are you sure you want to delete "${projectName}"?`)) {
//     // Create a form to submit POST request
//     const form = document.createElement("form");
//     form.method = "POST";
//     form.action = `/projects/delete/${projectId}`;
//     document.body.appendChild(form);
//     form.submit();
//   }
// }
