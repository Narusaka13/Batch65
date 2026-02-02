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

// temp memory
let projects = [];
// event submit form
addproject.addEventListener("submit", function (e) {
  e.preventDefault();

  let projectname = document.getElementById("ProjectName").value;
  let start = document.getElementById("start-date").value;
  let end = document.getElementById("end-date").value;
  let desc = document.getElementById("description").value;

  const project = { projectname, start, end, desc };
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
    <div class="Project p-2 mb-3">
    <h5>Project : ${projects[i].projectname}</h5>
    <h5>
      Duration : <span><h5>${projects[i].start} => ${projects[i].end}</h5></span>
    </h5>
    <h5>
      Project description:
      <span>
        <p>${projects[i].desc}</p>
      </span>
    </h5>
  </div>`;
  }
}
