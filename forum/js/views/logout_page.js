export default async function () {
    window.location.href = "/login"

    try {
        let response = await fetch("/logout-attempt")
        console.log(response)
    } catch (e){
        console.error(e)
    }
    
    localStorage.removeItem("userData")
}
