export default function () {

    document.title = "Register"

    document.getElementById("app").innerHTML = `
            <form id="registerForm" method="POST">
                <input type="text" placeholder="Nickname" name="register_nickname">
                <input type="text" placeholder="Age" name="register_age">
                <input type="text" placeholder="Gender" name="register_gender">
                <input type="text" placeholder="First Name" name="register_fname">
                <input type="text" placeholder="Last Name" name="register_lname">
                <input type="text" placeholder="E-mail" name="register_mail">
                <input type="password" placeholder="Password" name="register_passwd">
                <button type="submit" class="button">Submit!</button>

            </form>
    ` 
}
