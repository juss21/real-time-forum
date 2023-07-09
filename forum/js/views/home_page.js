import { hasSession } from "../helpers.js";
import { navigateTo } from "./router.js";
import { openMessenger } from "./messenger.js";
import { fetchPosts } from "./home_data.js";


export default async function () {
    const isAuthenticated = await hasSession()

    if (isAuthenticated) {
        // await loadPosts()
        let currentUser = JSON.parse(localStorage.getItem("currentUser"))

        document.title = "Home"
        let online = 5
        document.getElementById("app").innerHTML = `

        <nav class="nav">
        <a class="nav__link">${online}👥</a>
        <a class="nav__link">Welcome, ${currentUser.LoginName}!</a>
        <a href="/" class="nav__link" data-link>Home</a>
        <a href="/logout" class="nav__link" data-link>Logout</a>
         </nav>
        <div id="home" class="home">
                <h1>Our forum!</h1>
        </div>


        <div id="posts"></div>

        <br>
        <div id="openedPost" style="display:none"><button class="closePostBTN" id="postCloseBTN">X</button>
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


        </div>
        </div>

        <button class="open-button" id="openButton">Messenger</button>
        <div id="messageBox" class="form-popup"></div>
        `
        fetchPosts("posts")

        const openButton = document.getElementById("openButton");
        openButton.addEventListener("click", openMessenger);

         document.getElementById("postCloseBTN").addEventListener("click", ()=>{
        document.getElementById("openedPost").style.display = "none";
    })
    }
}


