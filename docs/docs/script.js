fetch('updates.json')
  .then(response => response.json())
  .then(data => {
    const list = document.getElementById('update-log');
    list.innerHTML = '';
    data.reverse().forEach(update => {
      const item = document.createElement('li');
      item.innerHTML = `<strong>${update.version}</strong> (${update.date}): ${update.description}`;
      list.appendChild(item);
      document.getElementById('current-version').textContent = update.version;
    });
  });

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dynamic year in footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
