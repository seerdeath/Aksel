const tg = window.Telegram.WebApp;
tg.expand();

const grid = document.getElementById("grid");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const timeInput = document.getElementById("time");
const nameInput = document.getElementById("name");
const confirmBtn = document.getElementById("confirm");
const cancelBtn = document.getElementById("cancel");

let selectedPC = null;

async function loadPCs() {
  const res = await fetch("https://ТВОЙ_СЕРВЕР/api/status");
  const data = await res.json();
  grid.innerHTML = "";

  Object.entries(data).forEach(([pc, info]) => {
    const div = document.createElement("div");
    div.className = "pc " + (info ? "busy" : "free");
    div.innerText = info ? `${pc}\nДо ${info.time}\n${info.name}` : `${pc}\nСвободен`;
    div.onclick = () => handleClick(pc, info);
    grid.appendChild(div);
  });
}

function handleClick(pc, info) {
  if (info) {
    tg.showAlert(`${pc} занято до ${info.time}`);
  } else {
    selectedPC = pc;
    popupTitle.innerText = `Бронь ${pc}`;
    popup.classList.remove("hidden");
  }
}

confirmBtn.onclick = async () => {
  const time = timeInput.value;
  const name = nameInput.value.trim();
  if (!time || !name) {
    tg.showAlert("Введите время и имя!");
    return;
  }
  await fetch(`https://ТВОЙ_СЕРВЕР/api/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pc: selectedPC, time, name })
  });
  tg.showAlert(`✅ ${selectedPC} забронирован!`);
  popup.classList.add("hidden");
  loadPCs();
};

cancelBtn.onclick = () => {
  popup.classList.add("hidden");
};

loadPCs();