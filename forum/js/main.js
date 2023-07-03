window.onload = () => {
    window.addEventListener("popstate", router)
    router()
}


async function router(){
    const routes = [
        {
            path: "/",
            view: main
        }
        {
            path: "/login",
            view: login
        }

    ]
}

function main(){
    console.log("viewing dashboard")
}

function login(){
    console.log("logging in")
}