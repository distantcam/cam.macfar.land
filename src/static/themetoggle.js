window.addEventListener("DOMContentLoaded", function (event) {
  const currentMode = localStorage.getItem("currentTheme") || "light";
  updateTheme(currentMode);
});

document.getElementById("toggle").addEventListener("click", function (event) {
  event.preventDefault();
  const currentMode = localStorage.getItem("currentTheme") || "light";
  const newMode = currentMode === "light" ? "dark" : "light";

  localStorage.setItem("currentTheme", newMode);

  document.documentElement.classList.add("transition");
  setTimeout(() => {
    document.documentElement.classList.remove("transition");
  }, 1000);

  updateTheme(newMode);
});

function updateTheme(newMode) {
  // document.documentElement.setAttribute("data-theme", newMode);
  const moon = document.getElementById("moon");
  const sun = document.getElementById("sun");
  if (newMode === "light") {
    document.documentElement.classList.remove('dark');
    sun.classList.add("hidden");
    moon.classList.remove("hidden");
  } else {
    document.documentElement.classList.add('dark');
    sun.classList.remove("hidden");
    moon.classList.add("hidden");
  }
}
