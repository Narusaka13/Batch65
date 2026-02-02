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
    userlist.innerHTML = "";

    for (let i = 0; i < projects.length; i++) {
      userlist.innerHTML += `
      <div class="card Project" style="width: 19rem">
      <img src="..." class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">Dumbways Web</h5>
        <p class="card-text fw-lighter fs-6 mb-0">2026-01-26 => 2026-02-01</p>
        <p class="card-text">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eum,
          accusantium modi possimus itaque doloribus corporis soluta facilis
          sit illum quaerat vel nemo voluptates! Cum, suscipit?
        </p>
        <a href="#" class="btn btn-success">Learn More!</a>
      </div>
    </div>
  `;
    }
  }
}
