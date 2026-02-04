// navigation.js

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

// input.js

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
    let tech = [];
    for (let i = 0; i < techCheckboxes.length; i++) {
      const checkbox = techCheckboxes[i];
      tech.push(checkbox.value);
    }
    // Create project object WITH ID
    const project = {
      id: projectId++,
      projectname,
      start,
      end,
      desc,
      technologies: tech,
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

  // Header change
  function changeElement(parameters) {
    document.getElementById(
      "input-user"
    ).innerHTML = `<p>New project has been added!!</p>`;
  }

  function renderUsers(parameters) {
    // Remove only non-placeholder cards
    const dynamicCards = userlist.querySelectorAll(
      ".card.Project:not([data-placeholder])"
    );
    dynamicCards.forEach((card) => card.remove());
    for (let i = 0; i < projects.length; i++) {
      // Create technology badges
      let techBadges = "";
      if (projects[i].technologies && projects[i].technologies.length > 0) {
        techBadges = projects[i].technologies
          .map((tech) => `<span class="badge bg-success me-1">${tech}</span>`)
          .join("");
      }
      // Create the card HTML
      const projectCard = `
    <div class="card Project col-md-6 col-lg-4" style="max-width: 19rem">
      <img src="..." class="card-img-top" alt="Project image" />
      <div class="card-body">
        <h5 class="card-title">${projects[i].projectname}</h5>
        <p class="card-text fw-lighter fs-6 mb-2">${projects[i].start} => ${projects[i].end}</p>
        <p class="card-text fw-light mb-2">${techBadges}</p>
        <p class="card-text text-truncate">${projects[i].desc}</p>
        <button onclick="navigateTo('detail', ${projects[i].id})" class="btn btn-success">
              Learn More!
            </button>
      </div>
    </div>
  `;
      // Add to the END of userlist (after placeholders)
      userlist.innerHTML += projectCard;
    }
  }
  // function displayProjectDetail(project) {
  //   // Update page elements
  //   document.getElementById("projectName").textContent = project.projectname;
  //   document.getElementById("date").textContent = `${project.start} - ${project.end}`;
  //   document.getElementById("description").textContent = project.desc;

  //   // Set image (use placeholder if none)
  //   const imageEl = document.getElementById("image");
  //   imageEl.src = project.image || "https://placehold.co/600x400";
  //   imageEl.alt = project.projectname;

  //   // Create technology badges
  //   const techBadges = project.technologies
  //     .map(tech => `<span class="badge bg-success me-1">${tech}</span>`)
  //     .join("");
  //   document.getElementById("technologies").innerHTML = techBadges;
  // }
}
