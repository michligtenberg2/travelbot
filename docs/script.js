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
