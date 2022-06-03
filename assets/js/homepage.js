var repoContainerEl = document.querySelector("#repos-container"); // html div element where repos are displayed
var repoSearchTerm = document.querySelector("#repo-search-term");// html span element where the user is displayed

var getUserRepos = function (user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos"; // api url, 

    // make a request to the url
    fetch(apiUrl).then(function (response) {
        if (response.ok) { // if request is successful, grab data and convert it to json
            response.json().then(function (data) {
                displayRepos(data, user);
            });
        } else { // if request is unsuccessful, send error alert
            alert("Error: github user not found");
        }
    })
        .catch(function (error) {
            // notice this .catch() getting chained onto the end of the .then() method
            alert("unable to connect ot github");
        });
};
 // store a refference to the <form> element
var userFormEl = document.querySelector("#user-form"); // variable for form element
var nameInputEl = document.querySelector("#username"); // variable for input element in html

var formSubmitHandler = function (event) {
    event.preventDefault();
    // get the value from input element
    var username = nameInputEl.value.trim(); //.trim() removes any trailing or leading space in the input. ex: " octocat" or "octocat "
    if (username) { // if there is an input in form, request repos for username
        getUserRepos(username);
        nameInputEl.value = ""; // clear input value for username
    } else { 
        alert("please enter a github username"); // alert if there is no input value
    }
    console.log(event);
};

// function to display data on page
var displayRepos = function (repos, searchTerm) {

    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found for this user.";
        return;
    }
    console.log(repos);
    console.log(searchTerm);

    repoContainerEl.textContent = ""; // clears out displayed repos
    repoSearchTerm.textContent = searchTerm; // displays search term

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        //formats repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
        
        // creates a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        //creates a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container element
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if the current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        // append to container
        repoEl.appendChild(statusEl);
        //append container element to dom
        repoContainerEl.appendChild(repoEl);
    }
};

userFormEl.addEventListener("submit", formSubmitHandler); // event listener for 'get user' button