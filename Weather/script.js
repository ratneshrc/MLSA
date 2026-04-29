let data = JSON.parse(localStorage.getItem("weatherData")) || [];

// Add entry
function addEntry() {
  let date = document.getElementById("date").value;
  let temp = document.getElementById("temp").value;
  let note = document.getElementById("note").value;

  if (!date || !temp || !note) {
    alert("Please fill all fields");
    return;
  }

  let entry = {
    date: date,
    temp: Number(temp),
    note: note
  };

  data.push(entry);
  localStorage.setItem("weatherData", JSON.stringify(data));

  displayEntries();
  calculateStats();
  calculateWeeklySummary();
}

// Show entries
function displayEntries() {
  let list = document.getElementById("entries");
  list.innerHTML = "";

  data.forEach(e => {
    let li = document.createElement("li");
    li.innerText = `${e.date} - ${e.temp}°C - ${e.note}`;
    list.appendChild(li);
  });
}

// Stats
function calculateStats() {
  if (data.length === 0) return;

  let total = 0;
  let best = data[0];
  let worst = data[0];

  data.forEach(e => {
    total += e.temp;
    if (e.temp > best.temp) best = e;
    if (e.temp < worst.temp) worst = e;
  });

  document.getElementById("avg").innerText = (total / data.length).toFixed(2);
  document.getElementById("best").innerText = best.date;
  document.getElementById("worst").innerText = worst.date;
}

// Weekly summary
function calculateWeeklySummary() {
  let today = new Date();
  let weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 7);

  let weekData = data.filter(e => {
    let d = new Date(e.date);
    return d >= weekAgo && d <= today;
  });

  document.getElementById("weekCount").innerText = weekData.length;

  if (weekData.length === 0) {
    document.getElementById("weekAvg").innerText = 0;
    return;
  }

  let total = 0;
  weekData.forEach(e => total += e.temp);

  document.getElementById("weekAvg").innerText = (total / weekData.length).toFixed(2);
}

// Export
function exportData() {
  let text = "Weather Journal Report\n\n";

  data.forEach(e => {
    text += `${e.date} - ${e.temp}°C - ${e.note}\n`;
  });

  let blob = new Blob([text], { type: "text/plain" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "weather_report.txt";
  a.click();
}

// Load on start
window.onload = function () {
  displayEntries();
  calculateStats();
  calculateWeeklySummary();
};