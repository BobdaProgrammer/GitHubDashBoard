let latestRepo = "";
let user = localStorage.getItem("user")
const urlParams = new URLSearchParams(window.location.search)

function addUser() {
      const clientId = "4532557c356a9027707c";
      const redirectUri = "githubdashboard.softwarespot.top";
      const scope = "user"; // Specify the scopes you need

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = authUrl;
  document.querySelector(".tile").style.display = "none";
  document.querySelector(".username").style.display = "none";
}
    function handleCallback() {
      accessToken = urlParams.get("code");
      let username;
        fetch("https://api.github.com/user", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Extract the username from the response data
            username = data.login; // 'login' is the key for the username in the GitHub API response
          })
          .catch((error) => {
            console.error("Error fetching user info:", error);
          });
      localStorage.setItem("user", username)
      user = username
    }

    // Check if the URL contains an access token after redirection

document.addEventListener("DOMContentLoaded", (event) => {
      if (urlParams.get("code") != null) {
        handleCallback();
      }
  if (user == null) {
    document.querySelector(".username").style.display = "block"
    document.querySelector(".tile").style.display = "block";
  }
  fetch("https://api.github.com/repositories?since=20232910")
    .then((response) => response.json())
    .then((data) => {
      // Process the trending repositories
      data.forEach((repo) => {
        let name = document.createElement("p");
        name.textContent = repo.name;
        document.getElementById("repohold").appendChild(name);
        let link = document.createElement("a");
        link.href = repo.html_url;
        link.target = "_blank";
        link.textContent = "open";
        document.getElementById("repohold").appendChild(link);
      });
    });

  fetch("https://www.reddit.com/r/ProgrammerHumor/.json?limit=30")
    .then((response) => response.json())
    .then((data) => {
      const posts = data.data.children.map((child) => child.data);

      const container = document.getElementById("reddithold");

      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const titleElement = document.createElement("h2");
        titleElement.textContent = post.title;
        titleElement.classList.add("postitle");
        postElement.appendChild(titleElement);

        if (post.selftext) {
          const selfTextElement = document.createElement("p");
          selfTextElement.textContent = post.selftext;
          postElement.appendChild(selfTextElement);
        }

        if (post.url) {
          const imageElement = document.createElement("img");
          imageElement.src = post.url;
          imageElement.alt = "Post Image";
          postElement.appendChild(imageElement);
        }

        container.appendChild(postElement);
      });
    });

  fetch(`https://api.github.com/users/${user}/events`)
    .then((response) => response.json())
    .then((data) => {
      // Filter the events to get only the PushEvents
      const pushEvents = data.filter((event) => event.type === "PushEvent");

      // The most recent push event is the first item in the array
      const recentPushEvent = pushEvents[0];

      // The repository information is in the `repo` property of the event
      latestRepo = recentPushEvent.repo.name;

      // The commits are in the `payload.commits` property of the event
      const commits = recentPushEvent.payload.commits;

      // The most recent commit is the last item in the array
      const recentCommit = commits[commits.length - 1];

      // The commit message is in the `message` property of the commit
      const recentMessage = recentCommit.message;

      const commitTime = new Date(recentPushEvent.created_at);

      // Extract the date and time
      const date = commitTime.toISOString().split("T")[0];
      const time = commitTime.toTimeString().split(" ")[0];
      document.getElementById("message").innerText = recentMessage;
      document.getElementById("commitdate").innerText = date;
      document.getElementById("committime").innerText = time;
      getLatestIssue();
    });
  const textarea = document.getElementById("ideas");
  textarea.value = localStorage.getItem("text");
  textarea.addEventListener("keydown", function (event) {
    if (
      textarea.value == "" &&
      (/^[a-zA-Z]$/.test(event.key) || !isNaN(event.key))
    ) {
      insertBulletPoint();
    }
  });
  textarea.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      insertBulletPoint();
    }
    localStorage.setItem("text", textarea.value);
  });

  function insertBulletPoint() {
    const text = textarea.value;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    const newText =
      text.substring(0, selectionStart) + "• " + text.substring(selectionEnd);
    textarea.value = newText;
    textarea.selectionStart = selectionStart + 2;
    textarea.selectionEnd = selectionStart + 2;
  }
});

function fetchlanguage(link) {
  return fetch(link, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }

      return response.json();
    })
    .then((data) => {
      for (let key in data) {
        languages[key]
          ? (languages[key] += data[key])
          : (languages[key] = data[key]);
      }
    })
    .catch((error) => {
      console.log("Fetch error: ", error);
    });
}


async function getLatestIssue() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${latestRepo}/issues`
    );
    if (response.ok) {
      const issues = await response.json();
      if (issues.length > 0) {
        const latestIssue = issues[0];
                document.getElementById("issue").innerText = latestIssue
      } else {
        document.getElementById("issue").innerText =
          "No issues found on the repository.";
      }
    } else {
      console.error("Error occurred while fetching issues:", response.status);
    }
  } catch (error) {
    console.error("Error occurred while fetching issues:", error);
  }
}



    $(document).ready(function () {
      var apiKey = process.env.API_KEY;
      var apiUrl =
        `https://newsapi.org/v2/everything?q=programming&q=code&sortBy=popularity&apiKey=` + apiKey;

      $.ajax({
        url: apiUrl,
        method: "GET",
        dataType: "json",
        success: function (response) {
          var articles = response.articles;

          // Iterate through the articles and display them
          articles.forEach(function (article) {
            var title = article.title;
            var description = article.description;
            var url = article.url;

            var newsItem =
              "<div>" +
              "<h3>" +
              title +
              "</h3>" +
              '<a href="' +
              url +
              '" target="_blank">Read More</a>' +
              "</div>";

            $("#news-container").append(newsItem);
            document.getElementById("news").innerHTML += newsItem;
          });
        },
        error: function (error) {
          console.log("Error:", error);
        },
      });
    });
