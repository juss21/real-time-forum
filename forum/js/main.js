import { createLoginPage } from "./views/login.js"
import { createRegisterPage } from "./views/register.js"
import { createHomePage } from "./views/home.js"
window.onload = () => {
    window.addEventListener("popstate", router)
    router()
}

function navigateTo(url) {
    history.pushState(null, null, url)
    router()

    //https://www.youtube.com/watch?v=6BozpmSjk-Y&ab_channel=dcode @21:15
}

async function router() {
    const routes = [
        {
            path: "/",
            view: createHomePage
        },
        {
            path: "/login",
            view: createLoginPage
        },
        {
            path: "/register",
            view: createRegisterPage
        }
    ]

    // test each route for potential match
    const potentialMatches = routes.map(route => {
        const isMatch = location.pathname === route.path
        const params = isMatch ? [] : null 
        return {
            route,
            isMatch,
            params
        }
    })
 
    
    let matchFound = potentialMatches.find(potentialMatches => potentialMatches.isMatch)

    // if no match, route back to homepage "/"
    if (!matchFound) {
        matchFound = {
            route: routes[0],
            isMatch: true
        }
    } 


    matchFound.route.view(matchFound.params) // <- changing scene with this
}


document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })

    router()
})