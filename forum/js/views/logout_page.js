export default async function () {
    localStorage.removeItem("userData")
    window.location.href = "/login"
}
