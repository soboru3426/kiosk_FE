document.querySelectorAll("button").forEach((button) => {
    if (button.getAttribute("onclick").includes(window.location.pathname)) {
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }
});