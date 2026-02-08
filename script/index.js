// ============ GLOBAL FUNCTIONS ============//

// LOGIC FOR navigation.js //
function navigateTo(page, projectId = null) {
  // Map pages URLs
  const pages = {
    home: "homepage.html",
    projects: "MyProjectpage.html",
    contact: "Contactpage.html",
    detail: "Detailpage.html",
  };
  // Go to the page with navigating to detail page
  if (page === "detail" && projectId) {
    window.location.href = `${pages.detail}?id=${projectId}`;
  } else {
    window.location.href = pages[page] || "HomePage.html";
  }
}
// Storage functions - used on multiple pages
function getProjectsFromStorage() {
  return JSON.parse(localStorage.getItem("projects")) || [];
}
function saveProjectsToStorage(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}
function getProjectById(id) {
  const projects = getProjectsFromStorage();
  return projects.find((project) => project.id === Number(id));
}
function getNextProjectId() {
  const projects = getProjectsFromStorage();
  if (projects.length === 0) return 1;
  return Math.max(...projects.map((p) => p.id || 0)) + 1;
}

// ============ LOGIC FOR myProjectpage ============ //

// Validation functions
function validateProjectForm(projectData) {
  if (!projectData.projectname?.trim()) {
    return "Project name is required";
  }
  if (!projectData.start) {
    return "Start date is required";
  }
  if (!projectData.end) {
    return "End date is required";
  }
  if (!projectData.desc?.trim()) {
    return "Description is required";
  }
  if (new Date(projectData.start) > new Date(projectData.end)) {
    return "Start date cannot be after end date";
  }
  return "";
}

// Project Card Renderer
//Tech Badges
function createTechnologyBadges(technologies) {
  if (!technologies || technologies.length === 0) return "";

  return technologies
    .map((tech) => `<span class="badge bg-success me-1">${tech}</span>`)
    .join("");
}
// Card Renderer
function createProjectCard(project) {
  const techBadges = createTechnologyBadges(project.technologies);

  return `
    <div class="card Project col-md-6 col-lg-4" style="max-width: 19rem">
      <img src="${project.image}" class="card-img-top" alt="${project.projectname}">
      <div class="card-body">
        <h5 class="card-title">${project.projectname}</h5>
        <p class="card-text fw-lighter fs-6 mb-2">${project.start} => ${project.end}</p>
        <p class="card-text fw-light mb-2">${techBadges}</p>
        <p class="card-text text-truncate">${project.desc}</p>
        <button onclick="navigateTo('detail', ${project.id})" 
                class="btn btn-success">
          Learn More!
        </button>
      </div>
    </div>
  `;
}
// No Results Message
function createNoResultsMessage() {
  return `
    <div class="no-results-message col-12 text-center py-5">
      <p class="text-muted">No projects found matching your filter criteria.</p>
      <button class="btn btn-link" onclick="resetFilters()">
        Clear filters
      </button>
    </div>
  `;
}
// Initial Empty State
function createInitialEmptyState() {
  return `
    <div class="no-results-message col-12 text-center py-5">
      <p class="text-muted">No projects yet. Create your first project!</p>
    </div>
  `;
}

// Filter Manager
let currentFilter = ["all"];
let currentSearch = "";
let isFilterActive = false;
// Filtering logic
function getFilterState() {
  return {
    filter: [...currentFilter],
    search: currentSearch,
    isActive: isFilterActive,
  };
}
//Udate filter logic
function setFilter(newFilter) {
  currentFilter = newFilter;
  isFilterActive = true;
}
// search filter logic
function setSearch(searchTerm) {
  currentSearch = searchTerm.toLowerCase();
  isFilterActive = true;
}
//reset filters logic
function resetFilters() {
  currentFilter = ["all"];
  currentSearch = "";
  isFilterActive = false;

  // Update UI
  updateFilterButtons(["all"]);
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  // Re-render projects
  const userlist = document.getElementById("userlist");
  if (userlist) {
    const projects = getProjectsFromStorage();
    renderProjects(projects, userlist);
  }
}
// Project Filtering logic
function applyFilters(projects) {
  if (
    !currentSearch &&
    currentFilter.length === 1 &&
    currentFilter[0] === "all"
  ) {
    return projects;
  }

  return projects.filter((project) => {
    // Technology filter
    if (currentFilter.length > 0 && !currentFilter.includes("all")) {
      const hasAnyTech = currentFilter.some((selectedTech) =>
        project.technologies?.some(
          (projectTech) =>
            projectTech.toLowerCase() === selectedTech.toLowerCase()
        )
      );
      if (!hasAnyTech) return false;
    }
    // Search filter
    if (currentSearch) {
      const searchMatch =
        project.projectname?.toLowerCase().includes(currentSearch) ||
        project.desc?.toLowerCase().includes(currentSearch) ||
        project.technologies?.some((tech) =>
          tech.toLowerCase().includes(currentSearch)
        );
      if (!searchMatch) return false;
    }
    return true;
  });
}

// UI Page Controler
function updateFilterButtons(activeFilters) {
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!filterButtons.length) return;

  filterButtons.forEach((btn) => {
    const tech = btn.getAttribute("data-tech");
    if (activeFilters.includes(tech)) {
      btn.classList.remove("btn-outline-secondary");
      btn.classList.add("btn-success");
    } else {
      btn.classList.remove("btn-success");
      btn.classList.add("btn-outline-secondary");
    }
  });
}
// Success Message Logic
function showSuccessMessage(message) {
  const inputUser = document.getElementById("input-user");
  if (!inputUser) return;
  inputUser.innerHTML = `<p class="text-success">${message}</p>`;
}
// Clear Content Logic
function clearDynamicContent(container) {
  const dynamicCards = container.querySelectorAll(
    ".card.Project:not([data-placeholder]), .no-results-message"
  );
  dynamicCards.forEach((card) => card.remove());
}

// Render function - specific to My Project Page
function renderProjects(projects, container) {
  clearDynamicContent(container);
  const allProjects = getProjectsFromStorage();

  if (projects.length === 0) {
    if (allProjects.length === 0 && !isFilterActive) {
      container.innerHTML += createInitialEmptyState();
    } else {
      container.innerHTML += createNoResultsMessage();
    }
    return;
  }

  const projectCards = projects
    .map((project) => createProjectCard(project))
    .join("");

  container.innerHTML += projectCards;
}

// My Project Page Event Handlers
function handleFilterButtonClick(event) {
  const button = event.currentTarget;
  const tech = button.getAttribute("data-tech");
  const projects = getProjectsFromStorage();

  let newFilters;
  if (tech === "all") {
    newFilters = ["all"];
  } else {
    if (currentFilter.includes("all")) {
      newFilters = [tech];
    } else if (currentFilter.includes(tech)) {
      newFilters = currentFilter.filter((f) => f !== tech);
    } else {
      newFilters = [...currentFilter, tech];
    }

    if (newFilters.length === 0) newFilters = ["all"];
  }

  setFilter(newFilters);
  updateFilterButtons(newFilters);

  const filteredProjects = applyFilters(projects);
  const userlist = document.getElementById("userlist");
  if (userlist) {
    renderProjects(filteredProjects, userlist);
  }
}

function handleSearchInput(event) {
  const projects = getProjectsFromStorage();
  setSearch(event.target.value);

  const filteredProjects = applyFilters(projects);
  const userlist = document.getElementById("userlist");
  if (userlist) {
    renderProjects(filteredProjects, userlist);
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  // Get form data
  const projectData = {
    projectname: document.getElementById("ProjectName").value.trim(),
    start: document.getElementById("start-date").value,
    end: document.getElementById("end-date").value,
    desc: document.getElementById("description").value.trim(),
    technologies: Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked')
    ).map((checkbox) => checkbox.value),
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  };

  // Validate
  const error = validateProjectForm(projectData);
  if (error) {
    alert(error);
    return;
  }

  // Save project
  const newProject = {
    id: getNextProjectId(),
    ...projectData,
  };

  const allProjects = getProjectsFromStorage();
  allProjects.push(newProject);
  saveProjectsToStorage(allProjects);

  // Reset form
  event.target.reset();

  // Show success message
  showSuccessMessage("New project has been added!");

  // Re-render based on current filter state
  const projectsToShow = isFilterActive
    ? applyFilters(allProjects)
    : allProjects;

  const userlist = document.getElementById("userlist");
  if (userlist) {
    renderProjects(projectsToShow, userlist);
  }
}

// My Project Page Initialization
const addproject = document.getElementById("addproject");
const userlist = document.getElementById("userlist");

if (addproject && userlist) {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("searchInput");

  // Load initial projects
  const projects = getProjectsFromStorage();

  // Initial render
  renderProjects(projects, userlist);

  // Setup event listeners
  filterButtons.forEach((button) => {
    button.addEventListener("click", handleFilterButtonClick);
  });

  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput);
  }

  addproject.addEventListener("submit", handleFormSubmit);
}
// ============ LOGIC FOR detail.js ============//
const container = document.getElementById("container");
if (container) {
  const projectName = document.getElementById("projectName");
  const image = document.getElementById("image");
  const date = document.getElementById("date");
  const technologies = document.getElementById("technologies");
  const description = document.getElementById("description");

  if (projectName && image && date && technologies && description) {
  }

  function renderDetailProject(project) {
    const technologiesData = project.technologies
      .map((tech) => `<span class="badge bg-success me-1">${tech}</span>`)
      .join("");

    projectName.innerText = project.projectname;
    image.src = project.image || "https://placehold.co/600x400";
    date.innerText = `${project.start} - ${project.end}`;
    technologies.innerHTML = technologiesData;
    description.innerText = project.desc;
  }

  function renderError(message, details) {
    container.innerHTML = `
      <div class="alert alert-danger">
        <h4>${message}</h4>
        <p>${details}</p>
        <a href="MyProjectpage.html" class="btn btn-primary">Back to Projects</a>
      </div>
    `;
  }

  // Load and display project data
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    renderDetailError("Project ID Not Found", "No project ID specified in URL");
  } else {
    const project = getProjectById(id);
    if (project) {
      renderDetailProject(project);
    } else {
      renderDetailError(
        "Project Not Found",
        `Project with ID ${id} was not found`
      );
    }
  }
}

// ==============================================
// PAGE DETECTION AND INITIALIZATION
// ==============================================

// Simple page detection based on URL
// document.addEventListener('DOMContentLoaded', function() {
//   const path = window.location.pathname;

//   if (path.includes('MyProjectpage.html')) {
//     initializeMyProjectPage();
//   } else if (path.includes('Detailpage.html')) {
//     initializeDetailPage();
//   }
//   // Other pages don't need special initialization
// });
