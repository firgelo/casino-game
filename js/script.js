// 1. Находим все элементы страницы
const button = document.querySelector('#кнопка');
const playerText = document.querySelector('.player');
const botText = document.querySelector('.bot');
const matchResult = document.querySelector('#c');
const jackpotText = document.querySelector('#jackpot-counter');
const coinsText = document.querySelector('#coins-counter');

// Находим элементы кубиков
const playerCube3D = document.querySelector('#player-dice-3d');
const botCube3D = document.querySelector('#bot-dice-3d');

// Находим элементы турбо-режима
const turboToggle = document.querySelector('#turbo-toggle');
let isTurboMode = false; 

// Находим элементы окон управления
const headerAuthBtn = document.querySelector('#auth-header-btn');
const authModal = document.querySelector('#auth-modal');
const modalInput = document.querySelector('#modal-username-input');
const modalSaveBtn = document.querySelector('#modal-save-btn');

// Находим элементы магазина и инвентаря
const shopOpenBtn = document.querySelector('#shop-open-btn');
const shopModal = document.querySelector('#shop-modal');
const shopCloseX = document.querySelector('#shop-close-x');
const shopItemsList = document.querySelector('#shop-items-list');

const invOpenBtn = document.querySelector('#inv-open-btn');
const invModal = document.querySelector('#inv-modal');
const invCloseX = document.querySelector('#inv-close-x');
const invItemsList = document.querySelector('#inv-items-list');

// Элементы окна автоматов (Коллекция)
const slotsOpenBtn = document.querySelector('#slots-open-btn');
const slotsModal = document.querySelector('#slots-modal');
const slotsCloseX = document.querySelector('#slots-close-x');
const slotsItemsList = document.querySelector('#slots-items-list');
const slotsSortBtn = document.querySelector('#slots-sort-btn');
const slotsTotalFpsText = document.querySelector('#slots-total-fps');

// Находим элементы окна промокодов
const promoOpenBtn = document.querySelector('#promo-open-btn');
const promoModal = document.querySelector('#promo-modal');
const promoCloseX = document.querySelector('#promo-close-x');
const promoInput = document.querySelector('#modal-promo-input');
const promoActivateBtn = document.querySelector('#modal-promo-activate-btn');

const spinBtn = document.querySelector('#spin-btn');
const wheel = document.querySelector('#wheel');

// ЭЛЕМЕНТЫ КЛИКЕРА
const coinClickBtn = document.querySelector('#clicker-coin');
const clickerBalanceText = document.querySelector('#clicker-balance');
const clickerPpsText = document.querySelector('#clicker-pps');
const buyUpgradeBtn = document.querySelector('#buy-upgrade-btn');
const buyClickPowerBtn = document.querySelector('#buy-click-power-btn');
const buyAutoFarmBtn = document.querySelector('#buy-auto-farm-btn');

// === ПОЛНАЯ БАЗА ДАННЫХ ИЗ 10 СКИНОВ ===
const SKINS_DATABASE = [
    { id: 'default', label: 'Стандартный (Бирюза)', price: 0, cssClass: '' },
    { id: 'purple', label: 'Фиолетовый неон', price: 50, cssClass: 'purple-skin' },
    { id: 'lime', label: 'Лайм неон', price: 80, cssClass: 'lime-skin' },
    { id: 'aqua', label: 'Морская волна', price: 100, cssClass: 'aqua-skin' },
    { id: 'orange', label: 'Вулкан неон', price: 120, cssClass: 'orange-skin' },
    { id: 'pink', label: 'Розовый фламинго', price: 140, cssClass: 'pink-skin' },
    { id: 'gold', label: 'Элитный золотой', price: 150, cssClass: 'gold-skin' },
    { id: 'ruby', label: 'Рубиновый взрыв', price: 200, cssClass: 'ruby-skin' },
    { id: 'acid', label: 'Кислотный неон', price: 300, cssClass: 'acid-skin' },
    { id: 'cyan', label: 'Электрик циан', price: 500, cssClass: 'cyan-skin' },
    { id: 'hacker', label: '⚡ HACKER_ADMIN_SKIN ⚡', price: 10000, cssClass: 'hacker-skin' }
];

// Загружаем сохраненные данные
let playerName = localStorage.getItem('casino_player_name');
let coinsBalance = Number(localStorage.getItem('casino_coins')) || 100;
let jackpotCount = Number(localStorage.getItem('casino_jackpots')) || 0;
let currentSkin = localStorage.getItem('casino_skin') || 'default';
let purchasedSkins = JSON.parse(localStorage.getItem('casino_purchased')) || {};

let clickerBalance = Number(localStorage.getItem('clicker_balance')) || 0;
let clickerUpgrades = Number(localStorage.getItem('clicker_upgrades')) || 0;
let clickPower = Number(localStorage.getItem('clicker_power')) || 1;

let slotsSortDirection = 'desc';

// === ЗАГРУЗКА АВТОМАТОВ (СТАРТОВЫЙ НАБОР: 10 ОБЫЧНЫХ, 5 ЭПИКОВ, 3 ЛЕГЕНДЫ) ===
let purchasedSlots = JSON.parse(localStorage.getItem('casino_purchased_slots'));

if (!purchasedSlots) {
    purchasedSlots = [];
    for (let i = 0; i < 10; i++) purchasedSlots.push({ type: 'common', name: 'Обычный автомат', income: 2 });
    for (let i = 0; i < 5; i++) purchasedSlots.push({ type: 'epic', name: 'Эпический автомат', income: 10 });
    for (let i = 0; i < 3; i++) purchasedSlots.push({ type: 'legendary', name: 'Легендарный автомат', income: 50 });
}

SKINS_DATABASE.forEach(item => {
    if (purchasedSkins[item.id] === undefined) { purchasedSkins[item.id] = (item.id === 'default'); }
});

if (!playerName) { openAuthModal(); } else { headerAuthBtn.textContent = `${playerName} 👤`; }

turboToggle.addEventListener('click', () => {
    isTurboMode = !isTurboMode;
    turboToggle.classList.toggle('active');
});

updateInterfaceTexts();
applyCurrentSkin();

function updateInterfaceTexts() {
    playerText.textContent = `${playerName || 'Ты'}: —`;
    botText.textContent = `Бот: —`;
    coinsText.textContent = `💰 Монеты: ${coinsBalance}`;
    jackpotText.textContent = `👑 Джекпотов: ${jackpotCount}`;
}

function saveGameData() {
    localStorage.setItem('casino_coins', coinsBalance);
    localStorage.setItem('casino_jackpots', jackpotCount);
    localStorage.setItem('casino_skin', currentSkin);
    localStorage.setItem('casino_purchased', JSON.stringify(purchasedSkins));
    localStorage.setItem('clicker_balance', clickerBalance);
    localStorage.setItem('clicker_upgrades', clickerUpgrades);
    localStorage.setItem('clicker_power', clickPower);
    localStorage.setItem('casino_purchased_slots', JSON.stringify(purchasedSlots));
    if (playerName) localStorage.setItem('casino_player_name', playerName);
}
// === ЛОГИКА ОКНА РЕГИСТРАЦИИ ===
function openAuthModal() { if (playerName) modalInput.value = playerName; authModal.classList.add('show'); }
function closeAuthModal() { authModal.classList.remove('show'); }
headerAuthBtn.addEventListener('click', openAuthModal);
modalSaveBtn.addEventListener('click', () => {
    let enteredName = modalInput.value.trim();
    if (enteredName === "") { alert("Пожалуйста, введите имя!"); return; }
    playerName = enteredName;
    headerAuthBtn.textContent = `${playerName} 👤`;
    playerText.textContent = `${playerName}: —`;
    saveGameData();
    closeAuthModal();
});

// === ЛОГИКА ОКНА ПРОМОКОДОВ 🎁 ===
promoOpenBtn.addEventListener('click', () => { promoInput.value = ''; promoModal.classList.add('show'); });
promoCloseX.addEventListener('click', () => promoModal.classList.remove('show'));
promoActivateBtn.addEventListener('click', () => {
    const code = promoInput.value.trim();
    if (code === "ffirgelo") {
        if (purchasedSkins.hacker) { alert("Промокод уже активирован!"); promoModal.classList.remove('show'); return; }
        purchasedSkins.hacker = true; currentSkin = 'hacker'; applyCurrentSkin(); saveGameData();
        alert("Поздравляем! ⚡ Хакерский скин применен!"); promoModal.classList.remove('show');
    } else if (code === "") { alert("Пожалуйста, введите промокод!"); } else { alert("Неверный промокод! 😢"); }
});

// === ДИНАМИЧЕСКИЙ МАГАЗИН И ИНВЕНТАРЬ ===
function openShopModal() {
    shopItemsList.innerHTML = ''; const unpurchased = SKINS_DATABASE.filter(item => !purchasedSkins[item.id]);
    if (unpurchased.length === 0) { shopItemsList.innerHTML = '<p style="color:#2ed573; font-size:14px; font-weight:bold;">Вы скупили весь магазин! 👑</p>'; } else {
        unpurchased.forEach(item => {
            const btn = document.createElement('button'); btn.className = 'modal-item-btn';
            if (item.id === 'hacker') { btn.innerHTML = `<span style="color: #00ff00; font-family: monospace;">${item.label}</span> <span style="color: #ff4757;">${item.price} 💰</span>`; btn.style.borderColor = '#00ff00'; } else { btn.innerHTML = `<span>${item.label}</span> <span>${item.price} 💰</span>`; }
            btn.addEventListener('click', () => {
                if (coinsBalance >= item.price) { coinsBalance -= item.price; purchasedSkins[item.id] = true; currentSkin = item.id; coinsText.textContent = `💰 Монеты: ${coinsBalance}`; applyCurrentSkin(); saveGameData(); openShopModal(); } else { alert(`Недостаточно монет! Требуется ${item.price} 💰`); }
            });
            shopItemsList.appendChild(btn);
        });
    }
    shopModal.classList.add('show');
}
shopOpenBtn.addEventListener('click', openShopModal);
shopCloseX.addEventListener('click', () => shopModal.classList.remove('show'));

function openInvModal() {
    invItemsList.innerHTML = ''; const owned = SKINS_DATABASE.filter(item => purchasedSkins[item.id]);
    owned.forEach(item => {
        const btn = document.createElement('button'); btn.className = 'modal-item-btn';
        if (currentSkin === item.id) { btn.className += ' active'; btn.innerHTML = `<span>${item.label}</span> <span>Применено ✔</span>`; } else { btn.innerHTML = `<span>${item.label}</span> <span>Выбрать</span>`; }
        btn.addEventListener('click', () => { currentSkin = item.id; applyCurrentSkin(); saveGameData(); openInvModal(); });
        invItemsList.appendChild(btn);
    });
    invModal.classList.add('show');
}
invOpenBtn.addEventListener('click', openInvModal);
invCloseX.addEventListener('click', () => invModal.classList.remove('show'));

function applyCurrentSkin() {
    matchResult.className = ''; const activeSkin = SKINS_DATABASE.find(item => item.id === currentSkin);
    if (activeSkin && activeSkin.cssClass !== '') matchResult.classList.add(activeSkin.cssClass);
}

// === ОКНО КОЛЛЕКЦИИ АВТОМАТОВ И СОРТИРОВКА (АЛЬБОМ С ПОДСВЕТКОЙ) 🎰 ===
function openSlotsModal() {
    slotsItemsList.innerHTML = '';
    let totalIncome = purchasedSlots.reduce((sum, item) => sum + item.income, 0);
    slotsTotalFpsText.textContent = `Всего качают: +${totalIncome} 💰/сек`;

    const countCommon = purchasedSlots.filter(s => s.type === 'common').length;
    const countEpic = purchasedSlots.filter(s => s.type === 'epic').length;
    const countLegendary = purchasedSlots.filter(s => s.type === 'legendary').length;

    let collectionData = [
        { type: 'common', name: 'Обычный автомат', count: countCommon, incomePerOne: 2, totalIncome: countCommon * 2, rarityClass: 'rarity-common', bg: '#2f3542', border: '#57606f' },
        { type: 'epic', name: 'Эпический автомат', count: countEpic, incomePerOne: 10, totalIncome: countEpic * 10, rarityClass: 'rarity-epic', bg: '#2c1a4d', border: '#bf55ec' },
        { type: 'legendary', name: 'Легендарный автомат', count: countLegendary, incomePerOne: 50, totalIncome: countLegendary * 50, rarityClass: 'rarity-legendary', bg: '#4d3a1a', border: '#ffd700' }
    ];

    if (slotsSortDirection === 'desc') {
        collectionData.sort((a, b) => b.totalIncome - a.totalIncome);
        slotsSortBtn.textContent = "Сортировка: По доходу ↓";
    } else {
        collectionData.sort((a, b) => a.totalIncome - b.totalIncome);
        slotsSortBtn.textContent = "Сортировка: По доходу ↑";
    }

    collectionData.forEach(slot => {
        const div = document.createElement('div');
        div.className = 'modal-item-btn';
        div.style.display = 'flex'; div.style.flexDirection = 'column'; div.style.alignItems = 'stretch'; div.style.gap = '5px'; div.style.padding = '15px';

        if (slot.count > 0) {
            div.style.backgroundColor = slot.bg; div.style.borderColor = slot.border; div.style.boxShadow = `0 0 10px ${slot.border}40`;
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; width:100%;">
                    <span class="${slot.rarityClass}" style="font-size:16px;">🎰 ${slot.name}</span>
                    <span style="color:#2ed573; font-weight:bold;">+${slot.totalIncome} 💰/сек</span>
                </div>
                <div style="display:flex; justify-content:space-between; width:100%; font-size:12px; color:#a4b0be; margin-top:5px;">
                    <span>В наличии: ${slot.count} шт.</span>
                    <span>1 шт = +${slot.incomePerOne} 💰/сек</span>
                </div>`;
        } else {
            div.style.backgroundColor = '#1e1e24'; div.style.borderColor = '#333'; div.style.opacity = '0.4'; div.style.cursor = 'not-allowed';
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; width:100%;">
                    <span style="color:#57606f; font-size:16px; font-family:monospace;">🔒 ${slot.name}</span>
                    <span style="color:#57606f; font-weight:bold;">Не выбит 🔒</span>
                </div>`;
        }
        slotsItemsList.appendChild(div);
    });
    slotsModal.classList.add('show');
}
slotsOpenBtn.addEventListener('click', openSlotsModal);
slotsCloseX.addEventListener('click', () => slotsModal.classList.remove('show'));
slotsSortBtn.addEventListener('click', () => { slotsSortDirection = (slotsSortDirection === 'desc') ? 'asc' : 'desc'; openSlotsModal(); });
// === ЛОГИКА 3D КУБИКОВ 🎲 ===
function getCubeRotation(diceValue) {
    const randomExtraTurnsX = Math.floor(Math.random() * 3) * 360;
    const randomExtraTurnsY = Math.floor(Math.random() * 3) * 360;
    if (diceValue === 1) return `rotateX(${720 + randomExtraTurnsX}deg) rotateY(${720 + randomExtraTurnsY}deg)`;
    if (diceValue === 6) return `rotateX(${180 + 720 + randomExtraTurnsX}deg) rotateY(${720 + randomExtraTurnsY}deg)`;
    if (diceValue === 4) return `rotateX(${720 + randomExtraTurnsX}deg) rotateY(${-90 + 720 + randomExtraTurnsY}deg)`;
    if (diceValue === 3) return `rotateX(${720 + randomExtraTurnsX}deg) rotateY(${90 + 720 + randomExtraTurnsY}deg)`;
    if (diceValue === 2) return `rotateX(${-90 + 720 + randomExtraTurnsX}deg) rotateY(${720 + randomExtraTurnsY}deg)`;
    if (diceValue === 5) return `rotateX(${90 + 720 + randomExtraTurnsX}deg) rotateY(${720 + randomExtraTurnsY}deg)`;
}

function playGame() {
    let playerDice = Math.floor(Math.random() * 6) + 1; let botDice = Math.floor(Math.random() * 6) + 1;
    if (isTurboMode) { playerCube3D.classList.add('fast-spin'); botCube3D.classList.add('fast-spin'); } 
    else { playerCube3D.classList.remove('fast-spin'); botCube3D.classList.remove('fast-spin'); }
    playerCube3D.style.transform = getCubeRotation(playerDice); botCube3D.style.transform = getCubeRotation(botDice);
    button.disabled = true; const spinDuration = isTurboMode ? 300 : 1500;
    setTimeout(() => {
        button.disabled = false; playerText.textContent = `${playerName || 'Ты'}: ${playerDice}`; botText.textContent = `Бот: ${botDice}`;
        if (playerDice > botDice) { matchResult.textContent = "ТЫ ВЫИГРАЛ! 🎉"; coinsBalance += 10; } 
        else if (playerDice < botDice) { matchResult.textContent = "КОМПЬЮТЕР ВЫИГРАЛ 🤖"; coinsBalance -= 5; } 
        else { matchResult.textContent = "НИЧЬЯ! 🤝"; }
        if (playerDice === 6) { matchResult.textContent = "ДЖЕКПОТ! 👑"; jackpotCount += 1; jackpotText.textContent = `👑 Джекпотов: ${jackpotCount}`; coinsBalance += 50; matchResult.classList.add('jackpot'); setTimeout(() => { matchResult.classList.remove('jackpot'); applyCurrentSkin(); }, 1500); }
        coinsText.textContent = `💰 Монеты: ${coinsBalance}`; saveGameData();
    }, spinDuration);
}
button.addEventListener('click', playGame);

// === ЛОГИКА КОЛЕСА ФОРТУНЫ ===
spinBtn.addEventListener('click', () => {
    const cost = 20; if (coinsBalance < cost) { alert("Не хватает монет!"); return; }
    coinsBalance -= cost; coinsText.textContent = `💰 Монеты: ${coinsBalance}`; saveGameData();
    spinBtn.disabled = true; matchResult.textContent = "Колесо вращается... 🎡";
    wheel.style.transition = 'none'; wheel.style.transform = 'rotate(0deg)'; wheel.offsetHeight; 
    const prizeIndex = Math.floor(Math.random() * 6); let targetDegree = 0;
    if (prizeIndex === 0) targetDegree = 30; if (prizeIndex === 1) targetDegree = 90; if (prizeIndex === 2) targetDegree = 150; if (prizeIndex === 3) targetDegree = 210; if (prizeIndex === 4) targetDegree = 270; if (prizeIndex === 5) targetDegree = 330;
    wheel.style.transition = 'transform 4s cubic-bezier(0.1, 0.8, 0.3, 1)'; wheel.style.transform = `rotate(${1800 - targetDegree}deg)`;
    setTimeout(() => {
        spinBtn.disabled = false;
        if (prizeIndex === 0) { matchResult.textContent = "Ничего не выпало... 😢"; } 
        else if (prizeIndex === 1) { matchResult.textContent = "🎁 СУПЕР ПРИЗ! Открыт Фиолетовый неон!"; purchasedSkins.purple = true; } 
        else if (prizeIndex === 2) { matchResult.textContent = "УДВОЕНИЕ! Баланс х2! 🔥"; coinsBalance *= 2; } 
        else if (prizeIndex === 3) { matchResult.textContent = "Выпало: +10 монет! 💰"; coinsBalance += 10; } 
        else if (prizeIndex === 4) { matchResult.textContent = "БАНКРОТ! Вы потеряли все монеты! 💀"; coinsBalance = 0; } 
        else if (prizeIndex === 5) { matchResult.textContent = "Выпало: +50 монет! 💎"; coinsBalance += 50; }
        coinsText.textContent = `💰 Монеты: ${coinsBalance}`; saveGameData();
    }, 4000);
});

// === ЛОГИКА ЗАЛИПАТЕЛЬНОГО КЛИКЕРА И АВТО-ФАРМИЛКИ КАЗИНО ⚡ ===
const coinWrapper = document.querySelector('#coin-wrapper');

// ФУНКЦИЯ ДЛЯ УМНОГО РАСЧЕТА ДИНАМИЧЕСКОЙ СТОИМОСТИ КЛИКА 💰
function getClickPowerCost() {
    if (clickPower < 10) {
        return 1000; // Первые 9 уровней стоят по 1000
    } else {
        // Формула: берем десятки уровня (например, для 13 это 1, для 25 это 2, для 31 это 3)
        // И умножаем на 10 000. Получаем: 10к, 20к, 30к, 40к и т.д.
        const tens = Math.floor(clickPower / 10);
        return tens * 10000;
    }
}

function updateClickerInterface() {
    clickerBalanceText.textContent = `₿ Кэш: ${clickerBalance}`;
    const pps = clickerUpgrades * 2; 
    clickerPpsText.textContent = `Доход/сек: +${pps}`;
    
    const nextPriceVideo = 50 + clickerUpgrades * 30; 
    buyUpgradeBtn.textContent = `Купить Видеокарту (${nextPriceVideo} ₿) [Ур. ${clickerUpgrades}]`;
    
    // Применяем умный расчет цены для текста на синей кнопке
    const nextPriceClick = getClickPowerCost();
    buyClickPowerBtn.textContent = `Клик +1 (${nextPriceClick} 💰) [Лвл. ${clickPower}]`;
    
    const nextPriceFarm = 150 + purchasedSlots.length * 50;
    buyAutoFarmBtn.textContent = `Купить Автомат (${nextPriceFarm} ₿) [Всего: ${purchasedSlots.length}]`;
}

coinClickBtn.addEventListener('click', () => {
    clickerBalance += clickPower; updateClickerInterface(); saveGameData();
    const plusOne = document.createElement('div'); plusOne.className = 'plus-one-animation'; plusOne.textContent = `+${clickPower}`;
    const randomX = Math.floor(Math.random() * 60) + 35; plusOne.style.left = `${randomX}px`; plusOne.style.top = `30px`;
    coinWrapper.appendChild(plusOne); setTimeout(() => { plusOne.remove(); }, 700);
});

// Покупка силы клика за монеты КАЗИНО 💰
buyClickPowerBtn.addEventListener('click', () => {
    // Получаем цену текущего уровня по нашей умной формуле
    const currentClickCost = getClickPowerCost();

    if (coinsBalance >= currentClickCost) {
        coinsBalance -= currentClickCost; 
        clickPower += 1; 
        coinsText.textContent = `💰 Монеты: ${coinsBalance}`; 
        updateClickerInterface(); 
        saveGameData();
    } else { 
        alert(`Нехватка фишек казино! Нужен ${currentClickCost} 💰.`); 
    }
});

buyUpgradeBtn.addEventListener('click', () => {
    const currentPrice = 50 + clickerUpgrades * 30;
    if (clickerBalance >= currentPrice) { clickerBalance -= currentPrice; clickerUpgrades += 1; updateClickerInterface(); saveGameData(); } else { alert("Не хватает Биткоинов! ⚡"); }
});

buyAutoFarmBtn.addEventListener('click', () => {
    const currentFarmPrice = 150 + purchasedSlots.length * 50;
    if (clickerBalance >= currentFarmPrice) {
        clickerBalance -= currentFarmPrice; const roll = Math.floor(Math.random() * 100); let newSlot = {};
        if (roll < 70) { newSlot = { type: 'common', name: 'Обычный автомат', income: 2 }; alert("Выпал Обычный автомат ⚪ (+2 💰/сек)!"); } 
        else if (roll < 90) { newSlot = { type: 'epic', name: 'Эпический автомат', income: 10 }; alert("🔥 ОГО! Выпал Эпический автомат 🟣 (+10 💰/сек)!"); } 
        else { newSlot = { type: 'legendary', name: 'Легендарный автомат', income: 50 }; alert("👑 ДЖЕКПОТ ЛУТБОКСА! Вылетел Легендарный автомат 🟡 (+50 💰/сек)!"); }
        purchasedSlots.push(newSlot); updateClickerInterface(); saveGameData();
    } else { alert(`Не хватает Биткоинов! Стоимость: ${currentFarmPrice} ₿.`); }
});

setInterval(() => {
    let dataChanged = false;
    if (clickerUpgrades > 0) { clickerBalance += clickerUpgrades * 2; dataChanged = true; }
    if (purchasedSlots.length > 0) {
        let totalIncome = purchasedSlots.reduce((sum, item) => sum + item.income, 0);
        coinsBalance += totalIncome; coinsText.textContent = `💰 Монеты: ${coinsBalance}`; dataChanged = true;
    }
    if (dataChanged) { updateClickerInterface(); saveGameData(); }
}, 1000);

updateClickerInterface();
