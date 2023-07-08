
export function postHtml(id) {
    let element = document.getElementById(id)


    let posts = 4

    for (let i = 0; i < posts; i++) {
        console.log("siin_")

        let post = document.createElement("div")
        post.id = `post-${i+1}`
        post.className = "post"
        post.innerHTML = `post-${i+1}`
        element.appendChild(post)
        element.appendChild(document.createElement("br"))

    }
}