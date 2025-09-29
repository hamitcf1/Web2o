function initHourglassAnimation(elementId) {
  const icon = document.getElementById(elementId);
  if (!icon) return; // ID bulunmazsa hatayı önler

  const icons = ["fa-hourglass-start", "fa-hourglass-half", "fa-hourglass-end"];
  let index = 0;

  setInterval(() => {
    icon.classList.add("fade-out");

    setTimeout(() => {
      icon.classList.remove("fa-hourglass-start", "fa-hourglass-half", "fa-hourglass-end");

      index = (index + 1) % icons.length;
      icon.classList.add(icons[index]);

      icon.classList.remove("fade-out");
      icon.classList.add("fade-in");

      setTimeout(() => {
        icon.classList.remove("fade-in");
      }, 600);
    }, 600);
  }, 2000);
}

// Kullanım — istediğin kadar ID ekleyebilirsin
initHourglassAnimation("hourglass");
initHourglassAnimation("todo-hourglass");