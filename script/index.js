// ============ LOGIC FOR navigation.js ============//
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

// ============ LOGIC FOR input.js ============ //
// input receiver
const addproject = document.getElementById("addproject");
const userlist = document.getElementById("userlist");
// conditional page check
if (addproject && userlist) {
  // Add counter for unique IDs
  let projectId = 1;
  // Load projects from localStorage OR start with empty array
  let projects = JSON.parse(localStorage.getItem("projects")) || [];
  if (projects.length > 0) {
    // Find the maximum ID in existing projects
    const storeId = Math.max(...projects.map((project) => project.id));
    projectId = storeId + 1;
    renderUsers();
  }
  // event submit form
  addproject.addEventListener("submit", function (e) {
    e.preventDefault();

    let projectname = document.getElementById("ProjectName").value;
    let start = document.getElementById("start-date").value;
    let end = document.getElementById("end-date").value;
    let desc = document.getElementById("description").value;
    // Get selected technologies from checkboxes
    let techCheckboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    let tech = Array.from(techCheckboxes).map((checkbox) => checkbox.value);
    // Create project object WITH ID
    const project = {
      id: projectId++,
      projectname,
      start,
      end,
      desc,
      technologies: tech,
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    };

    // Add to the array
    projects.push(project);
    // Save to localStorage
    localStorage.setItem("projects", JSON.stringify(projects));
    // Check data input to array;
    console.log(projects);
    // Update UI
    changeElement();
    renderUsers();
  });

  // Header change //
  function changeElement() {
    document.getElementById(
      "input-user"
    ).innerHTML = `<p>New project has been added!!</p>`;
  }

  function renderUsers() {
    // Remove only non-placeholder cards
    const dynamicCards = userlist.querySelectorAll(
      ".card.Project:not([data-placeholder])"
    );
    dynamicCards.forEach((card) => card.remove());
    // Create project cards
    const projectCard = projects
      .map((project) => {
        // Create technology badges
        const techBadges =
          project.technologies && project.technologies.length > 0
            ? project.technologies
                .map(
                  (tech) => `<span class="badge bg-success me-1">${tech}</span>`
                )
                .join("")
            : "";
        // Create the card HTML
        return `
    <div class="card Project col-md-6 col-lg-4" style="max-width: 19rem">
      <img src="..." class="card-img-top" alt="Project image" />
      <div class="card-body">
        <h5 class="card-title">${project.projectname}</h5>
        <p class="card-text fw-lighter fs-6 mb-2">${project.start} => ${project.end}</p>
        <p class="card-text fw-light mb-2">${techBadges}</p>
        <p class="card-text text-truncate">${project.desc}</p>
        <button onclick="navigateTo('detail', ${project.id})" class="btn btn-success">
              Learn More!
            </button>
      </div>
    </div>
  `;
      })
      .join("");
    // Add to the END of userlist (after placeholders)
    userlist.innerHTML += projectCard;
  }
}

// ============ LOGIC FOR detail.js ============//
const container = document.getElementById("container");
if (container) {
  const projectName = document.getElementById("projectName");
  const image = document.getElementById("image");
  const date = document.getElementById("date");
  const technologies = document.getElementById("technologies");
  const description = document.getElementById("description");

  const fillData = function (project) {
    const technologiesData = project.technologies
      .map((tech) => `<span class="badge bg-success me-1">${tech}</span>`)
      .join("");

    projectName.innerText = project.projectname;
    image.src = project.image || "https://placehold.co/600x400";
    date.innerText = `${project.start} - ${project.end}`;
    technologies.innerHTML = technologiesData;
    description.innerText = project.desc;
  };
  // Function to prepare and load data
  const prepareData = function () {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      container.innerHTML = `
          <div class="alert alert-danger">
            <h4>Id is not found</h4>
            <p>Id not included in URL</p>
            <a href="MyProjectpage.html" class="btn btn-primary">Back to Projects</a>
          </div>
        `;
      return;
    }

    const result = localStorage.getItem("projects");
    if (!result) {
      container.innerHTML = `
        <div class="alert alert-danger">
        <h4>No projects found</h4>
        <p>No projects data in localStorage</p>
        <a href="MyProjectpage.html" class="btn btn-primary">Back to Projects</a>
      </div>
    `;
      return;
    }

    const data = JSON.parse(result);
    const project = data.find((d) => d.id === Number(id));

    if (project) {
      fillData(project);
    } else {
      container.innerHTML = `
      <div class="alert alert-danger">
        <h4>Data is not found</h4>
        <p>Project with id ${id} not found</p>
        <a href="MyProjectpage.html" class="btn btn-primary">Back to Projects</a>
      </div>
    `;
    }
  };

  // Run on page load
  prepareData();
}
