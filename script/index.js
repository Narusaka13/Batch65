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

// input.js

// input receiver
const addproject = document.getElementById("addproject");
const userlist = document.getElementById("userlist");
// conditional page check
if (addproject && userlist) {
  // temp memory
  let projects = [];
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
    const project = { projectname, start, end, desc, technologies: tech };
    projects.push(project);
    console.log(projects);

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
    <div class="card Project" style="max-width: 19rem">
      <img src="..." class="card-img-top" alt="Project image" />
      <div class="card-body">
        <h5 class="card-title">${projects[i].projectname}</h5>
        <p class="card-text fw-lighter fs-6 mb-0">${projects[i].start} => ${projects[i].end}</p>
        <p class="card-text fw-light mb-2">${techBadges}</p>
        <p class="card-text">${projects[i].desc}</p>
        <a href="#" class="btn btn-success">Learn More!</a>
      </div>
    </div>
  `;
      // Add to the END of userlist (after placeholders)
      userlist.innerHTML += projectCard;
    }
  }
}
