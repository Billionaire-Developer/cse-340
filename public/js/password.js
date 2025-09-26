const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function() {
const pswdInput = document.getElementById("password");
const pswdType = pswdInput.getAttribute("type");
if (pswdType == "password") {
    pswdInput.setAttribute("type", "text")
    pswdBtn.innerHTML = "Hide Password";
} else {
    pswdInput.setAttribute("type", "password")
    pswdBtn.innerHTML = "Show Password";
}
})