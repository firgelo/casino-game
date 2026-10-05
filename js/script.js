```js
"use strict";

/*
=========================================================
FIRGELO BITCOIN CLICKER
Main game engine
=========================================================
*/

const SAVE_KEY = "firgelo_bitcoin_clicker_v2";
const CLICK_COOLDOWN = 55;


/* ======================================================
   UPGRADES
====================================================== */

const UPGRADES = [

    {
        id: "gpu",
        icon: "🖥️",
        name: "RTX 5090",
        description: "+0.5 BTC / sec",
        baseCost: 25,
        dps: 0.5
    },

    {
        id: "asic",
        icon: "⚡",
        name: "ASIC Miner",
        description: "+2 BTC / sec",
        baseCost: 100,
        dps: 2
    },

    {
        id: "rig",
        icon: "⛏️",
        name: "Mining Rig",
        description: "+7 BTC / sec",
        baseCost: 450,
        dps: 7
    },

    {
        id: "farm",
        icon: "🏭",
        name: "Crypto Farm",
        description: "+25 BTC / sec",
        baseCost: 1800,
        dps: 25
    },

    {
        id: "datacenter",
        icon: "🏢",
        name: "Mega Data Center",
        description: "+100 BTC / sec",
        baseCost: 9000,
        dps: 100
    },

    {
        id: "quantum",
        icon: "🔮",
        name: "Quantum Miner",
        description: "+500 BTC / sec",
        baseCost: 50000,
        dps: 500
    },

    {
        id: "industrial",
        icon: "🏗️",
        name: "Industrial Mining Complex",
        description: "+2,500 BTC / sec",
        baseCost: 250000,
        dps: 2500
    },

    {
        id: "plasma",
        icon: "🔥",
        name: "Plasma Miner",
        description: "+6,000 BTC / sec",
        baseCost: 500000,
        dps: 6000
    },

    {
        id: "fusion",
        icon: "☢️",
        name: "Fusion Mining Core",
        description: "+15,000 BTC / sec",
        baseCost: 1000000,
        dps: 15000
    },

    {
        id: "orbital",
        icon: "🛰️",
        name: "Orbital Mining Station",
        description: "+50,000 BTC / sec",
        baseCost: 3000000,
        dps: 50000
    },

    {
        id: "megastructure",
        icon: "🌐",
        name: "Mega Mining Network",
        description: "+120,000 BTC / sec",
        baseCost: 5000000,
        dps: 120000
    },

    {
        id: "dyson",
        icon: "☀️",
        name: "Dyson Mining Array",
        description: "+300,000 BTC / sec",
        baseCost: 10000000,
        dps: 300000
    },

    {
        id: "quantumcore",
        icon: "💠",
        name: "Quantum Core",
        description: "+750,000 BTC / sec",
        baseCost: 25000000,
        dps: 750000
    },

    {
        id: "galactic",
        icon: "🌌",
        name: "Galactic Mining Empire",
        description: "+2,000,000 BTC / sec",
        baseCost: 50000000,
        dps: 2000000
    }

];


/* ======================================================
   ACHIEVEMENTS
====================================================== */

const ACHIEVEMENTS = [

    {
        id: "first",
        icon: "🥉",
        name: "First Satoshi",
        description: "Make your first click",
        requirement: 1,
        bonus: 0.05
    },

    {
        id: "hundred",
        icon: "💯",
        name: "Getting Started",
        description: "Mine 100 BTC",
        requirement: 100,
        bonus: 0.10
    },

    {
        id: "thousand",
        icon: "🚀",
        name: "Crypto Player",
        description: "Mine 1,000 BTC",
        requirement: 1000,
        bonus: 0.25
    },

    {
        id: "million",
        icon: "👑",
        name: "Bitcoin King",
        description: "Mine 100,000 BTC",
        requirement: 100000,
        bonus: 1
    }

];


/* ======================================================
   DEFAULT STATE
====================================================== */

const DEFAULT_STATE = {

    balance: 0,

    totalMined: 0,

    totalClicks: 0,

    level: 1,

    xp: 0,

    upgrades: {},

    achievements: {},

    lastSave: Date.now()

};


/* ======================================================
   LOAD
====================================================== */

function loadGame() {

    try {

        const saved =
            localStorage.getItem(SAVE_KEY);

        if (!saved) {

            return structuredClone(
                DEFAULT_STATE
            );

        }

        const data =
            JSON.parse(saved);

        return {

            ...structuredClone(
                DEFAULT_STATE
            ),

            ...data,

            upgrades: {
                ...DEFAULT_STATE.upgrades,
                ...(data.upgrades || {})
            },

            achievements: {
                ...DEFAULT_STATE.achievements,
                ...(data.achievements || {})
            }

        };

    } catch (error) {

        console.error(
            "Save loading error:",
            error
        );

        return structuredClone(
            DEFAULT_STATE
        );

    }

}


let state = loadGame();


/* ======================================================
   DOM
====================================================== */

const balanceEl =
    document.querySelector("#balance");

const dpcEl =
    document.querySelector("#dpc");

const dpsEl =
    document.querySelector("#dps");

const levelEl =
    document.querySelector("#level");

const levelTextEl =
    document.querySelector("#levelText");

const xpTextEl =
    document.querySelector("#xpText");

const xpBarEl =
    document.querySelector("#xpBar");

const coinEl =
    document.querySelector("#coin");

const upgradeListEl =
    document.querySelector("#upgradeList");

const achievementListEl =
    document.querySelector("#achievementList");

const toastEl =
    document.querySelector("#toast");


/* ======================================================
   FORMAT
====================================================== */

function formatNumber(value) {

    if (!Number.isFinite(value)) {

        return "0";

    }

    if (value < 1000) {

        return value.toFixed(
            value % 1 === 0 ? 0 : 2
        );

    }

    const units = [
        "",
        "K",
        "M",
        "B",
        "T",
        "Qa",
        "Qi"
    ];

    let unit = 0;

    while (
        value >= 1000 &&
        unit < units.length - 1
    ) {

        value /= 1000;

        unit++;

    }

    return value.toFixed(
        value >= 100 ? 0 :
        value >= 10 ? 1 :
        2
    ) + units[unit];

}


/* ======================================================
   ACHIEVEMENT BONUS
====================================================== */

function getAchievementBonus() {

    return ACHIEVEMENTS.reduce(

        (total, achievement) => {

            if (
                state.achievements[
                    achievement.id
                ]
            ) {

                return total +
                    achievement.bonus;

            }

            return total;

        },

        0
    );

}


/* ======================================================
   DPC
====================================================== */

function getDPC() {

    const base = 1;

    const levelBonus =
        (state.level - 1) * 0.1;

    const achievementBonus =
        getAchievementBonus();

    return (
        base +
        levelBonus +
        achievementBonus
    );

}


/* ======================================================
   DPS
====================================================== */

function getDPS() {

    return UPGRADES.reduce(

        (total, upgrade) => {

            const level =
                state.upgrades[
                    upgrade.id
                ] || 0;

            return total +
                upgrade.dps * level;

        },

        0
    );

}


/* ======================================================
   UPGRADE COST
====================================================== */

function getUpgradeCost(upgrade) {

    const level =
        state.upgrades[
            upgrade.id
        ] || 0;

    return Math.floor(
        upgrade.baseCost *
        Math.pow(1.15, level)
    );

}


/* ======================================================
   XP
====================================================== */

function getXPRequired() {

    return Math.floor(
        100 *
        Math.pow(
            1.28,
            state.level - 1
        )
    );

}


function addXP(amount) {

    state.xp += amount;

    while (
        state.xp >=
        getXPRequired()
    ) {

        state.xp -=
            getXPRequired();

        state.level++;

        showToast(
            `🎉 LEVEL ${state.level}!`
        );

    }

}


/* ======================================================
   ACHIEVEMENTS
====================================================== */

function checkAchievements() {

    for (
        const achievement
        of ACHIEVEMENTS
    ) {

        if (
            !state.achievements[
                achievement.id
            ] &&

            state.totalMined >=
            achievement.requirement
        ) {

            state.achievements[
                achievement.id
            ] = true;

            showToast(
                `🏆 ${achievement.name}`
            );

        }

    }

}


/* ======================================================
   MINE
====================================================== */

let lastClick = 0;


function mine(event) {

    const now =
        performance.now();

    if (
        now - lastClick <
        CLICK_COOLDOWN
    ) {

        return;

    }

    lastClick = now;

    const amount =
        getDPC();

    state.balance +=
        amount;

    state.totalMined +=
        amount;

    state.totalClicks++;

    addXP(1);

    checkAchievements();

    coinEl.classList.remove(
        "pressed"
    );

    void coinEl.offsetWidth;

    coinEl.classList.add(
        "pressed"
    );

    setTimeout(
        () => coinEl.classList.remove(
            "pressed"
        ),
        120
    );

    const x =
        event.clientX ||
        window.innerWidth / 2;

    const y =
        event.clientY ||
        window.innerHeight / 2;

    createFloatingNumber(
        x,
        y,
        `+${formatNumber(amount)}`
    );

    createParticles(
        x,
        y
    );

    updateUI();

}


/* ======================================================
   FLOATING NUMBER
====================================================== */

function createFloatingNumber(
    x,
    y,
    text
) {

    const element =
        document.createElement("div");

    element.className =
        "floating";

    element.textContent =
        text;

    element.style.left =
        `${x}px`;

    element.style.top =
        `${y}px`;

    document.body.appendChild(
        element
    );

    setTimeout(
        () => element.remove(),
        800
    );

}


/* ======================================================
   PARTICLES
====================================================== */

function createParticles(
    x,
    y
) {

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );

        particle.className =
            "particle";

        particle.style.left =
            `${x}px`;

        particle.style.top =
            `${y}px`;

        const angle =
            Math.random() *
            Math.PI *
            2;

        const distance =
            45 +
            Math.random() *
            95;

        particle.style.setProperty(
            "--x",
            `${Math.cos(angle) * distance}px`
        );

        particle.style.setProperty(
            "--y",
            `${Math.sin(angle) * distance}px`
        );

        document.body.appendChild(
            particle
        );

        setTimeout(
            () => particle.remove(),
            800
        );

    }

}


/* ======================================================
   RENDER UPGRADES
====================================================== */

function renderUpgrades() {

    upgradeListEl.innerHTML = "";

    for (
        const upgrade
        of UPGRADES
    ) {

        const level =
            state.upgrades[
                upgrade.id
            ] || 0;

        const cost =
            getUpgradeCost(
                upgrade
            );

        const canBuy =
            state.balance >=
            cost;

        const element =
            document.createElement(
                "div"
            );

        element.className =
            "upgrade";

        element.innerHTML = `

            <div class="upgrade-icon">
                ${upgrade.icon}
            </div>

            <div>

                <div class="upgrade-name">
                    ${upgrade.name}
                </div>

                <div class="upgrade-desc">
                    ${upgrade.description}
                </div>

                <div class="upgrade-level">
                    LVL ${level}
                </div>

            </div>

            <button
                class="buy"
                data-upgrade="${upgrade.id}"
                ${canBuy ? "" : "disabled"}
            >
                BUY

                <span class="cost">
                    ${formatNumber(cost)} BTC
                </span>

            </button>

        `;

        upgradeListEl.appendChild(
            element
        );

    }

}


/* ======================================================
   BUY
====================================================== */

function buyUpgrade(id) {

    const upgrade =
        UPGRADES.find(
            item =>
                item.id === id
        );

    if (!upgrade) {

        return;

    }

    const cost =
        getUpgradeCost(
            upgrade
        );

    if (
        state.balance <
        cost
    ) {

        showToast(
            "Not enough BTC"
        );

        return;

    }

    state.balance -=
        cost;

    state.upgrades[id] =
        (state.upgrades[id] || 0) + 1;

    showToast(
        `${upgrade.icon} ${upgrade.name} upgraded!`
    );

    saveGame();

    updateUI();

}


/* ======================================================
   ACHIEVEMENT UI
====================================================== */

function renderAchievements() {

    achievementListEl.innerHTML =
        "";

    for (
        const achievement
        of ACHIEVEMENTS
    ) {

        const unlocked =
            !!state.achievements[
                achievement.id
            ];

        const element =
            document.createElement(
                "div"
            );

        element.className =
            unlocked
                ? "achievement unlocked"
                : "achievement";

        element.innerHTML = `

            <div class="achievement-icon">
                ${achievement.icon}
            </div>

            <div class="achievement-name">
                ${achievement.name}
            </div>

            <div class="achievement-description">
                ${achievement.description}
            </div>

        `;

        achievementListEl.appendChild(
            element
        );

    }

}


/* ======================================================
   UI
====================================================== */

function updateUI() {

    balanceEl.textContent =
        formatNumber(
            state.balance
        );

    dpcEl.textContent =
        `+${formatNumber(
            getDPC()
        )}`;

    dpsEl.textContent =
        formatNumber(
            getDPS()
        );

    levelEl.textContent =
        state.level;

    levelTextEl.textContent =
        `Level ${state.level}`;

    const required =
        getXPRequired();

    xpTextEl.textContent =
        `${formatNumber(
            state.xp
        )} / ${formatNumber(
            required
        )}`;

    xpBarEl.style.width =
        `${Math.min(
            100,
            state.xp /
            required *
            100
        )}%`;

    renderUpgrades();

    renderAchievements();

}


/* ======================================================
   GAME LOOP
====================================================== */

let lastTick =
    performance.now();


function gameLoop(now) {

    const delta =
        Math.min(
            now - lastTick,
            1000
        ) / 1000;

    lastTick =
        now;

    const income =
        getDPS() *
        delta;

    if (
        income > 0
    ) {

        state.balance +=
            income;

        state.totalMined +=
            income;

        checkAchievements();

        updateUI();

    }

    requestAnimationFrame(
        gameLoop
    );

}


/* ======================================================
   OFFLINE INCOME
====================================================== */

function calculateOfflineIncome() {

    const elapsed =
        Math.max(
            0,
            Math.min(
                Date.now() -
                state.lastSave,

                8 *
                60 *
                60 *
                1000
            )
        );

    if (
        elapsed < 10000
    ) {

        return;

    }

    const earned =
        getDPS() *
        (elapsed / 1000);

    if (
        earned <= 0
    ) {

        return;

    }

    state.balance +=
        earned;

    state.totalMined +=
        earned;

    setTimeout(
        () => {

            showToast(
                `💤 Offline: +${formatNumber(
                    earned
                )} BTC`
            );

        },
        500
    );

}


/* ======================================================
   SAVE
====================================================== */

function saveGame() {

    state.lastSave =
        Date.now();

    try {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(state)
        );

    } catch (error) {

        console.error(
            "Save error:",
            error
        );

    }

}


/* ======================================================
   TOAST
====================================================== */

let toastTimer;


function showToast(message) {

    toastEl.textContent =
        message;

    toastEl.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toastEl.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* ======================================================
   EVENTS
====================================================== */

coinEl.addEventListener(
    "pointerdown",
    mine
);


upgradeListEl.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-upgrade]"
            );

        if (!button) {

            return;

        }

        buyUpgrade(
            button.dataset.upgrade
        );

    }
);


/* ======================================================
   AUTOSAVE
====================================================== */

setInterval(
    saveGame,
    5000
);


window.addEventListener(
    "beforeunload",
    saveGame
);


document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "hidden"
        ) {

            saveGame();

        }

    }
);


/* ======================================================
   START
====================================================== */

calculateOfflineIncome();

updateUI();

requestAnimationFrame(
    gameLoop
);
```
