// ============ GLOBAL FUNCTIONS ============//

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
    window.location.href = `${pages.detail}?id=${projectId}`;
  } else {
    window.location.href = pages[page] || "Homepage";
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

  // In createProjectCard function:
  return `
  <div class="card Project col-md-6 col-lg-4 shadow-lg cursor-pointer" style="max-width: 19rem;">
    <div onclick="navigateTo('detail', ${
      project.id
    })" class="text-decoration-none">
      <img src="${project.image}" class="card-img-top" alt="${
    project.projectname
  }" style="height: 200px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${project.projectname}</h5>
        <p class="card-text fw-lighter fs-6 mb-2">${project.start} → ${
    project.end
  }</p>
        <p class="card-text fw-light mb-2">${techBadges}</p>
        <p class="card-text text-truncate">${project.desc}</p>
      </div>
    </div>
    <div class="d-flex justify-content-end gap-2">
      <button onclick="editProject(${project.id})" 
              class="btn btn-warning btn-sm">
        Edit
      </button>
      <button onclick="confirmDelete(${
        project.id
      }, '${project.projectname.replace(/'/g, "\\'")}')" 
              class="btn btn-outline-danger btn-sm">
        Delete
      </button>
    </div>
  </div>
  `;
}
// Delete Main Function Logic //
// Delete comfirmation logic
function confirmDelete(projectId, projectName) {
  // Show confirmation dialog
  const isConfirmed = confirm(`Delete "${projectName}"?`);
  // conditional to delete the project
  if (isConfirmed) {
    deleteProject(projectId);
  }
}
// Delete Project Logic
function deleteProject(projectId) {
  // Get all projects from localStorage
  const allProjects = getProjectsFromStorage();
  // Filtering by projectId. Creat a new array without the deleted project
  const updatedProjects = allProjects.filter(
    (project) => project.id !== Number(projectId)
  );
  // Save the updated projects to localStorage
  saveProjectsToStorage(updatedProjects);
  // Show success message
  alert("Project deleted successfully");
  // Rerreder the projects
  refreshProjects();
  // logic if deleted project is currently being edited (additional logic)
  if (isEditMode && currentEditId === Number(projectId)) {
    exitEditMode();
  }
}
// Edit Project Logic //
// Project Card Editning Logic
function editProject(projectId) {
  // Get project from localStorage
  const project = getProjectById(projectId);
  // Verify Saved Project in LocalStorage
  if (!project) {
    alert("Project not found!");
    return;
  }
  // Mode Scwitching Logic
  isEditMode = true; // Set Edit Mode
  currentEditId = projectId; // Store edited project ID
  // Change form title
  const formTitle = document.querySelector(".contact-header h1");
  if (formTitle) {
    formTitle.innerText = "EDIT MY PROJECT";
  }
  // Change submit button text
  const submitBtn = document.querySelector(".submit-btn");
  if (submitBtn) {
    submitBtn.innerText = "Update";
  }
  // Show cancel edit button
  showCancelButton();
  // Refilling the form with project data
  document.getElementById("ProjectName").value = project.projectname || "";
  document.getElementById("start-date").value = project.start || "";
  document.getElementById("end-date").value = project.end || "";
  document.getElementById("description").value = project.desc || "";
  // Uncehck all checkboxes
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  allCheckboxes.forEach((checkbox) => (checkbox.checked = false));
  // Recheck the Checkboxes with project technologies
  if (project.technologies && Array.isArray(project.technologies)) {
    project.technologies.forEach((tech) => {
      // Find checkbox with matching value (case-insensitive)
      const checkbox = Array.from(allCheckboxes).find(
        (cb) => cb.value.toLowerCase() === tech.toLowerCase()
      );
      if (checkbox) checkbox.checked = true;
    });
  }
  // Form Scrolling Logic
  const formElement = document.getElementById("addproject");
  if (formElement) {
    formElement.scrollIntoView({ behavior: "smooth" });
  }
}
// Cancel Edit Button Logic
function showCancelButton() {
  // Conditional Check
  let cancelBtn = document.getElementById("cancelEditBtn");
  if (!cancelBtn) {
    // Create Cancel Edit Button
    const formSubmitDiv = document.querySelector(".form-submit");
    if (formSubmitDiv) {
      cancelBtn = document.createElement("button");
      cancelBtn.id = "cancelEditBtn";
      cancelBtn.type = "button";
      cancelBtn.className = "btn btn-secondary ms-2";
      cancelBtn.innerText = "Cancel";
      cancelBtn.onclick = exitEditMode; // Event Handler
      // Add button after the submit button
      formSubmitDiv.appendChild(cancelBtn);
    }
  } else {
    // Show Cancel Edit Button
    cancelBtn.style.display = "inline-block";
  }
}

// Exit Edit Mode Logic
function exitEditMode() {
  // Reset Mode
  isEditMode = false;
  currentEditId = null;
  // Clearing the form
  const form = document.getElementById("addproject");
  if (form) {
    form.reset();
  }
  // Reset Form Title
  const formTitle = document.querySelector(".contact-header h1");
  if (formTitle) {
    formTitle.innerText = "ADD MY PROJECT";
  }
  // Reset Submit Button
  const submitBtn = document.querySelector(".submit-btn");
  if (submitBtn) {
    submitBtn.innerText = "Submit";
  }
  // Hide Cancel Edit Button
  const cancelBtn = document.getElementById("cancelEditBtn");
  if (cancelBtn) {
    cancelBtn.style.display = "none";
  }
  // Clear Success Message
  const inputUser = document.getElementById("input-user");
  if (inputUser) {
    inputUser.innerHTML = "Please fill out the form below to add new project";
  }
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
  refreshProjects();
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
      // Check if any of the selected technologies are in the project's technologies
      const hasAnyTech = currentFilter.every((selectedTech) =>
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

// Sorting Logic
//sort variables
let sortField = "name";
let sortOrder = "asc";
// Defined the form mode, either adding (false) or editing (true)
let isEditMode = false; // form adding by default
let currentEditId = null; // Store edited project id

// Sorting function
function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    let valueA, valueB;
    // Get values based on field
    switch (sortField) {
      case "name":
        valueA = a.projectname?.toLowerCase() || "";
        valueB = b.projectname?.toLowerCase() || "";
        break;
      case "startDate":
        valueA = new Date(a.start);
        valueB = new Date(b.start);
        break;
      case "endDate":
        valueA = new Date(a.end);
        valueB = new Date(b.end);
        break;
      //Default case
      default:
        valueA = a.projectname?.toLowerCase() || "";
        valueB = b.projectname?.toLowerCase() || "";
    }
    // Compare with order
    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
}

// Update sorting and refresh
function updateSorting(field = sortField, order = sortOrder) {
  sortField = field;
  sortOrder = order;
  updateSortUI();
  refreshProjects();
}

// Refresh function for updating
function refreshProjects() {
  const allProjects = getProjectsFromStorage();
  const filtered = applyFilters(allProjects);
  const sorted = sortProjects(filtered);
  const userlist = document.getElementById("userlist");
  if (userlist) renderProjects(sorted, userlist);
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

// Render function in My Project Page
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

  refreshProjects();
}

function handleSearchInput(event) {
  setSearch(event.target.value);
  refreshProjects();
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
  }; // Validate
  const error = validateProjectForm(projectData);
  if (error) {
    alert(error);
    return;
  }
  // Conditional Check
  if (isEditMode && currentEditId) {
    // Editing Project Logic
    // Get all projects
    const allProjects = getProjectsFromStorage();
    // Find updated project index
    const projectIndex = allProjects.findIndex(
      (p) => p.id === Number(currentEditId)
    );
    // CONDITIONAL CHECK
    if (projectIndex !== -1) {
      // Update project data with same original ID
      allProjects[projectIndex] = {
        ...projectData, // New data from form
        id: currentEditId, // Keep original ID
      };
      // Save to localStorage
      saveProjectsToStorage(allProjects);
      // Show success alert
      alert("Project updated successfully!");
      // Exit editing and reset form
      exitEditMode();
    } else {
      alert("Error: Project not found for update");
    }
  } else {
    // Add Project Logic
    const newProject = {
      id: getNextProjectId(),
      ...projectData,
    };
    //Add project to localStorage
    const allProjects = getProjectsFromStorage();
    allProjects.push(newProject);
    saveProjectsToStorage(allProjects);
    // Reset form
    event.target.reset();

    // Show success alert
    alert("New project has been added!");
    showSuccessMessage("New project has been added!");
  }
  refreshProjects();
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

  updateSortUI();
}
// Update dropdown selections
function updateSortUI() {
  const fieldSelect = document.getElementById("sortField");
  const orderSelect = document.getElementById("sortOrder");

  if (fieldSelect) fieldSelect.value = sortField;
  if (orderSelect) orderSelect.value = sortOrder;
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
    renderError("Project ID Not Found", "No project ID specified in URL");
  } else {
    const project = getProjectById(id);
    if (project) {
      renderDetailProject(project);
    } else {
      renderError("Project Not Found", `Project with ID ${id} was not found`);
    }
  }
}
