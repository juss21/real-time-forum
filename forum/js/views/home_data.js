export function createPostHtml(id, data) {
    let element = document.getElementById(id)
    //element.innerHTML = ""

    for (let i = 0; i < data.length; i++) {
        const post = document.createElement("div")
        post.id = `post-${data[i].PostID}`
        post.className = "post"
        post.innerHTML = `${data[i].Title}<br>${data[i].OriginalPoster}`
        element.appendChild(post)
        element.appendChild(document.createElement("br"))
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


