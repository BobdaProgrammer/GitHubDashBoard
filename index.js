let latestRepo = "";

let snippets = JSON.parse(localStorage.getItem("snippets"))||[]

function deserializeArray(str) {
  if (!str) return [];
  return JSON.parse(str);
}

function Save() {
  snippets.push([document.getElementById("title").value,document.getElementById("code").value]);
  localStorage.setItem("snippets", JSON.stringify(snippets));
  putSnippets();
}

function Copy(num) {
  navigator.clipboard.writeText(snippets[num][1])
}

function takeOff (num){
  snippets.splice(num,1);
  localStorage.setItem("snippets", JSON.stringify(snippets));
  putSnippets();
}

function putSnippets() {
  document.getElementById("snippethold").innerHTML = "";
    for (let z = 0; z < snippets.length; z++) {
      let snippet = document.createElement("div");
      snippet.classList.add("snippet");
      snippet.classList.add("statblock");
      snippet.innerHTML = `
    <span class="snippetTitle">${snippets[z][0]}</span>
    <button class="copy snipBut" id="copy" onclick="Copy(${z})"><img src="copy.png"></button>
    <button class="delete snipBut" id="delete" onclick="takeOff(${z})"><img src="delete.png"></button>
    `;
      document.getElementById("snippethold").appendChild(snippet);
    }
}


document.addEventListener("DOMContentLoaded", (event) => {
  console.log(snippets)

  putSnippets();
  // Create a Date object for the current date
  const currentDate = new Date();

  // Get day, month, and year components
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const year = currentDate.getFullYear();

  // Format the date components as "dd-mm-yyyy"
  const formattedDate = `${day.toString().padStart(2, "0")}/${month
    .toString()
    .padStart(2, "0")}/${year}`;

  console.log(formattedDate);

  document.getElementById("date").textContent = formattedDate;
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

  fetch("https://api.github.com/users/BobdaProgrammer/events")
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
      var apiKey = "efb870784c5a4dd9886b44c899043c0a";
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