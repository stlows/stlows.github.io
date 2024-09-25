document.querySelectorAll(".burger").forEach(e => {
  const element = document.getElementById(e.dataset.activator)
  e.addEventListener("click", () => {
    element.classList.toggle("active")
  })
})