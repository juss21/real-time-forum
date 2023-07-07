import home_page from "./views/home_page.js"
import error_page from "./views/error_page.js"
import login_page from "./views/login_page.js"
import register_page from "./views/register_page.js"
import logout_page from "./views/logout_page.js"

import { wsAddConnection } from "./websocket.js"
import { hasSession } from "./helpers.js"

const isAuthenticated = await hasSession()
if (isAuthenticated){
    wsAddConnection()
}

window.onload = () => {
    window.addEventListener("popstate", router)
    router()
}

export function navigateTo(url) {
    history.pushState(null, null, url)
    router()

    //https://www.youtube.com/watch?v=6BozpmSjk-Y&ab_channel=dcode @21:15
}

async function router() {
    const routes = [
        {
            path: "/",
            view: home_page
        },
        {
            path: "/login",
            view: login_page
        },
        {
            path: "/logout",
            view: logout_page
        }
    ]

    // test each route for potential match
    const potentialMatches = routes.map(route => {
        const isMatchBoolean = location.pathname === route.path
        return {
            route: route,
            isMatch: isMatchBoolean
        }
    })


    let matchFound = potentialMatches.find(potentialMatches => potentialMatches.isMatch)
    if (matchFound) {
        matchFound.route.view()// <- changing scenery with this
    } else {
        error_page();
    }
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