import { createLoginPage } from "./views/login.js"
import { createRegisterPage } from "./views/register.js"
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
            view: createLoginPage
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
    const pontentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })
 
    
    let matchFound = pontentialMatches.find(pontentialMatch => pontentialMatch.isMatch)

    // if no match, route back to homepage "/"
    if (!matchFound) {
        matchFound = {
            route: routes[0],
            isMatch: true
        }
    } 


    console.log(matchFound.route.view()) // <- changing scene with this
}


document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.isMatch("[data-link]")) {
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })

    router()
})