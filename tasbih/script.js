lucide.createIcons();



/* ================= DOM ELEMENTS ================= */
const display = document.getElementById("display");
const incrementBtn = document.getElementById("increment");
const decrementBtn = document.getElementById("decrement");
const resetBtn = document.getElementById("reset");

const selectedZikr = document.getElementById("selectedZikr");
const zikrOptions = document.querySelector(".zikr-options");
const zikrTextEl = document.getElementById("zikrText");

const openSettings = document.getElementById("openSettings");
const closeSettings = document.getElementById("closeSettings");
const modal = document.getElementById("settingsModal");

const themeButtons = document.querySelectorAll("[data-theme]");
const customColor = document.getElementById("customColor");

const tasbeehSound = document.getElementById("tasbeehSound");
const soundToggle = document.getElementById("soundToggle");

const ring = document.querySelector(".ring-progress");

const openAbout = document.getElementById("openAbout");
const closeAbout = document.getElementById("closeAbout");
const aboutModal = document.getElementById("aboutModal");


openAbout.addEventListener("click", () => {
    modal.classList.add("hidden");
    aboutModal.classList.remove("hidden");
});

closeAbout.addEventListener("click", () => {
    aboutModal.classList.add("hidden");
});


/* ================= RING SETUP ================= */
const radius = 110;
const circumference = 2 * Math.PI * radius;
ring.style.strokeDasharray = circumference;
ring.style.strokeDashoffset = circumference;

/* ================= STATE ================= */
let count = 0;
let soundEnabled = true;
let currentZikr = "subhanallah";

let customZikrText = "Custom Zikr";
let customZikrLimit = 33;

/* ================= ZIKR DATA ================= */
const zikrLimits = {
    subhanallah: 33,
    alhamdulillah: 33,
    allahuakbar: 34,
    astaghfirullah: 100,
    lailaha: 100,
    custom: () => customZikrLimit
};

const zikrMap = {
    subhanallah: "سبحان الله",
    alhamdulillah: "الحمد لله",
    allahuakbar: "الله أكبر",
    astaghfirullah: "أستغفر الله",
    lailaha: "لا إله إلا الله",
    custom: () => customZikrText
};

/* ================= NOOR PARTICLES ================= */
const noorContainer = document.getElementById("noor-particles");
setInterval(() => {
    const noor = document.createElement("span");
    noor.className = "noor";
    noor.style.left = Math.random() * 100 + "%";
    noor.style.animationDuration = (Math.random() * 10 + 10) + "s";
    noorContainer.appendChild(noor);
    setTimeout(() => noor.remove(), 20000);
}, 700);

/* ================= FUNCTIONS ================= */
function getCurrentLimit() {
    return typeof zikrLimits[currentZikr] === "function"
        ? zikrLimits[currentZikr]()
        : zikrLimits[currentZikr];
}

function getCurrentZikrText() {
    return typeof zikrMap[currentZikr] === "function"
        ? zikrMap[currentZikr]()
        : zikrMap[currentZikr];
}

function updateRing() {
    const limit = getCurrentLimit();
    ring.style.strokeDashoffset =
        circumference - (count / limit) * circumference;

    display.classList.toggle("zero", count === 0);
}

/* ================= ZIKR SELECTOR ================= */
selectedZikr.addEventListener("click", e => {
    e.stopPropagation();
    zikrOptions.classList.toggle("hidden");
});

zikrOptions.querySelectorAll("div").forEach(option => {
    option.addEventListener("click", () => {
        currentZikr = option.dataset.value;

        if (currentZikr === "custom") {
            const text = prompt("Enter custom zikr text:");
            const limit = prompt("Enter target count (e.g. 33 or 100):", "33");

            if (!text || isNaN(limit) || Number(limit) <= 0) {
                currentZikr = "subhanallah";
                return;
            }

            customZikrText = text;
            customZikrLimit = Number(limit);
        }

        zikrTextEl.textContent = getCurrentZikrText();
        count = 0;
        display.textContent = count;
        zikrOptions.classList.add("hidden");
        updateRing();
    });
});

/* ================= COUNTER ================= */
incrementBtn.addEventListener("click", () => {
    count++;

    if (soundEnabled) {
        tasbeehSound.currentTime = 0;
        tasbeehSound.play();
    }

    if (count >= getCurrentLimit()) count = 0;

    display.textContent = count;
    updateRing();
});

decrementBtn.addEventListener("click", () => {
    if (count > 0) count--;
    display.textContent = count;
    updateRing();
});

resetBtn.addEventListener("click", () => {
    count = 0;
    display.textContent = count;
    updateRing();
});

/* ================= SETTINGS MODAL ================= */
openSettings.addEventListener("click", e => {
    e.stopPropagation();
    modal.classList.remove("hidden");
    display.style.visibility = "hidden";
});

closeSettings.addEventListener("click", () => {
    modal.classList.add("hidden");
    display.style.visibility = "visible";
});

document.addEventListener("click", e => {
    if (!modal.contains(e.target) && !openSettings.contains(e.target)) {
        modal.classList.add("hidden");
        zikrOptions.classList.add("hidden");
        display.style.visibility = "visible";
    }
});

/* ================= THEMES  ================= */
const themes = {
    dark: "#061a15",
    green: "#0b3d2e",
    blue: "#0a2540",
    gold: "#2c2200"
};

themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        document.documentElement.style.setProperty(
            "--bg",
            themes[btn.dataset.theme]
        );
    });
});

/* ================= CUSTOM COLOR ================= */
customColor.addEventListener("input", e => {
    document.documentElement.style.setProperty("--bg", e.target.value);
});

/* ================= SOUND TOGGLE ================= */
soundToggle.addEventListener("change", () => {
    soundEnabled = soundToggle.checked;
});

/* ================= INIT ================= */
zikrTextEl.textContent = getCurrentZikrText();
updateRing();
