export function createPostHtml(id, data) {
    let element = document.getElementById(id)
    element.innerHTML = ""

    for (let i = 0; i < data.length; i++) {

        const postDiv = document.createElement("div")
        postDiv.id = `post-${data[i].PostID}`
        postDiv.className = "post"

        const post = document.createElement("a")
        post.id = `post-${data[i].PostID}`
        post.href = `/get-comments?PostID=${data[i].PostID}`

        const datePosted = document.createElement("div")
        datePosted.className = "datePosted"
        datePosted.innerHTML = `${data[i].Date}`
        post.appendChild(datePosted)

        const category = document.createElement("div")
        category.className = "postCategory"
        category.innerHTML = `${data[i].Category}`
        post.appendChild(category)

        const title = document.createElement("div")
        title.className = "postTitle"
        title.innerHTML = `${data[i].Title}`
        post.appendChild(title)

        const op = document.createElement("div")
        op.className = "originalPoster"
        op.innerHTML = `Posted by: ${data[i].OriginalPoster}`
        post.appendChild(op)


        postDiv.appendChild(post)
        element.appendChild(postDiv)
        element.appendChild(document.createElement("br"))
    }

    element.addEventListener("click", handlePostClick)
}

function handlePostClick(event) {
    // Check if the clicked element has the "post" class
    if (event.target.classList.contains("post")) {
        event.preventDefault(); // Prevent the default link behavior

        const postId = event.target.id.replace("post-", "")
        fetchComments(postId);
    }
}

export async function fetchPosts(id) {
    try {
        const url = "/get-posts";
        const response = await fetch(url);
        if (response.ok) {
            let data = await response.json();
            createPostHtml(id, data)
        } else {
            console.log("Failed to fetch user data.");
        }
    } catch (e) {
        console.error(e);
    }
}

async function fetchComments(postId) {
    try {
        const url = `/get-comments?PostID=${postId}`;
        const response = await fetch(url);

        if (response.ok) {
            let data = await response.json();
            // Process the fetched comments data
            console.log(data)
            openPost(postId, data)
        } else {
            console.log("Failed to fetch comments data.");
        }
    } catch (e) {
        console.error(e);
    }
}


function openPost(postId, data) {
    let element = document.getElementById("openedPost")
    element.innerHTML = ""
    element.className = `post-${postId}`
    for (let i = 0; i < data.length; i++) {
        let comment = document.createElement("div")
        let poster = document.createElement("h3")
        let date = document.createElement("p")
        poster.innerHTML = data[i].OriginalPoster
        comment.innerHTML = data[i].Content
        date.innerHTML = data[i].Date

        comment.appendChild(poster)
        comment.appendChild(date)
        element.appendChild(comment)
    }
}