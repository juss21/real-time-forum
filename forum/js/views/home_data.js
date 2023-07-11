export function createPostHtml(id, data) {
    let element = document.getElementById(id)
    element.innerHTML = ""

    for (let i = 0; i < data.length; i++) {

        const postDiv = document.createElement("div")
        postDiv.id = `post-${data[i].PostID}`
        postDiv.className = "post"

        const post = document.createElement("a")
        post.id = `post-${data[i].PostID}`
        //post.href = `/get-comments?PostID=${data[i].PostID}`

        const datePosted = document.createElement("div")
        datePosted.className = "datePosted"
        datePosted.id = `post-${data[i].PostID}`

        datePosted.innerHTML = `${data[i].Date}`
        post.appendChild(datePosted)

        const category = document.createElement("div")
        category.className = "postCategory"
        category.id = `post-${data[i].PostID}`

        category.innerHTML = `${data[i].Category}`
        post.appendChild(category)

        const title = document.createElement("div")
        title.className = "postTitle"
        title.id = `post-${data[i].PostID}`

        title.innerHTML = `${data[i].Title}`
        post.appendChild(title)

        const op = document.createElement("div")
        op.className = "originalPoster"
        op.id = `post-${data[i].PostID}`
        op.innerHTML = `Posted by: ${data[i].OriginalPoster}`
        post.appendChild(op)


        postDiv.appendChild(post)
        element.appendChild(postDiv)
        element.appendChild(document.createElement("br"))
    }

    element.addEventListener("click", handlePostClick)
}

function handlePostClick(event) {
    // Check if the clicked element has the "post" id
    const target = event.target
    if (target.id.includes("post-")) {
        event.preventDefault() // Prevent the default link behavior

        const postId = event.target.id.replace("post-", "")
        fetchComments(postId)
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
    element.style.display = "inline"
    element.className = `post-${postId}`



    let title = document.getElementById("openedPostTitle")
    title.innerHTML = data.postData.Title
    let content = document.getElementById("openedPostContent")
    content.innerHTML = data.postData.Content

    let owner = document.getElementById("openedPostOriginalPoster")
    owner.innerHTML = data.postData.OriginalPoster

    let date = document.getElementById("openedPostDate")
    date.innerHTML = data.postData.Date




    for (let i = 0; i < data.comments.length; i++) {


        createComment(data.comments[i].Content, data.comments[i].OriginalPoster, data.comments[i].Date)
        // comment.appendChild(poster)
        // comment.appendChild(date)
        // element.appendChild(comment)
    }
}

function createComment(commentContent, commentOP, commentDate) {
    let commentSection = document.getElementById("openedPostCommentSection")

    let commentBody = document.createElement("div")
    commentBody.id = "openedPostComment"

    // left side (avatar/user/date)
    let commentAvatarBody = document.createElement("div")
    commentAvatarBody.id = "openedPostCommentAvatar"

    let avatar = document.createElement("img")
    avatar.src = "/forum/images/avatarTemplate.png"
    avatar.id = "profilepic"

    let div = document.createElement("div")
    let commentor = document.createElement("div")
    commentor.id = "openedPostCommentOP"
    commentor.innerHTML = commentOP
    let comment_date = document.createElement("div")
    comment_date.id = "openedPostCommentDate"
    comment_date.innerHTML = commentDate
    div.appendChild(commentor)
    div.appendChild(comment_date)
    commentAvatarBody.appendChild(avatar)

    commentAvatarBody.appendChild(div)
    commentBody.appendChild(commentAvatarBody)

    let content = document.createElement("div")
    content.id = "openedPostCommentContent"
    content.innerHTML = commentContent
    let content_div = document.createElement("div")
    content.appendChild(content_div)

    commentBody.appendChild(content)

    commentSection.appendChild(commentBody)

    /*
               
            </div>
            <div id="openedPostCommentContent"><div>Content goes here</div></div>
            </div>
    
     */

}

/* 
  <div id="openedPost" style="display:none"><button class="closePostBTN">X</button>
        <div id="openedPostSection">
        <div id="openedPostTitle">Pealkiri</div>
        <div id="openedPostContent">siin on mingi sisue</div>
        <div id="openedPostOriginalPoster">Madis</div>
        <div id="openedPostDate">23 feb</div>
        <div id="openedPostAvatar"><img id="profilepic" src="/forum/images/avatarTemplate.png"></div>
        </div>
        
        <div id="openedPostCommentSection">
            <div id="openedPostComment">
            <div id="openedPostCommentAvatar">
            <img id="profilepic" src="/forum/images/avatarTemplate.png">
            <div>
                <div id="openedPostCommentOP">Taat</div>
                <div id="openedPostCommentDate">24 Feb</div>
            </div>
        </div>
        <div id="openedPostCommentContent"><div>Content goes here</div></div>
        </div>

 */