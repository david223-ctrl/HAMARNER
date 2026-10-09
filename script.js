let gameData = JSON.parse(localStorage.getItem('arm_game_data_v2')) || {
    balance: 100000,
    spinCount: 0,
    maxSlots: 50,
    upgradeCost: 100000,
    temporaryNumbers: [],
    myNumbers: []
};

let balance = gameData.balance;
let spinCount = gameData.spinCount;
let maxSlots = gameData.maxSlots;
let upgradeCost = gameData.upgradeCost;
let temporaryNumbers = gameData.temporaryNumbers;
let myNumbers = gameData.myNumbers;

let shopNumbers = [];
let selectedTempIndex = null; 

const regionCodes = ["01", "11", "35", "61", "43", "77", "90", "24", "51"];
const lettersList = ["LL", "OO", "SS", "FF", "VV", "QQ", "DD", "MM", "CC", "AA", "XX"];

function saveGame() {
    const data = {
        balance: balance,
        spinCount: spinCount,
        maxSlots: maxSlots,
        upgradeCost: upgradeCost,
        temporaryNumbers: temporaryNumbers,
        myNumbers: myNumbers
    };
    localStorage.setItem('arm_game_data_v2', JSON.stringify(data));
}

function initShop() {
    shopNumbers = [
        { number: "99 LL 999", price: 30000000, seller: "Համարների Թագավոր", rarity: "legendary" },
        { number: "01 OO 001", price: 5000000, seller: "VIP Մագազին", rarity: "mythic" },
        { number: "43 SS 777", price: 2000000, seller: "Անհայտ Միլիարդատեր", rarity: "epic" },
        { number: "61 VV 555", price: 500000, seller: "Երևանյան Ցանց", rarity: "rare" }
    ];
}
initShop();

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-600/40');
        el.classList.add('bg-slate-900', 'text-slate-400', 'border-slate-800');
    });

    document.getElementById('tab-' + tabId).classList.remove('hidden');
    
    if (tabId === 'spin' || tabId === 'shop' || tabId === 'my-numbers') {
        const activeBtn = document.getElementById('nav-' + tabId);
        if (activeBtn) {
            activeBtn.classList.remove('bg-slate-900', 'text-slate-400', 'border-slate-800');
            activeBtn.classList.add('bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-600/40');
        }
    }

    if (tabId === 'shop') renderShop();
    if (tabId === 'my-numbers') renderMyNumbers();
    if (tabId === 'temporary') renderTemporaryNumbers();
}

function generateArmenianCarNumber() {
    const region = regionCodes[Math.floor(Math.random() * regionCodes.length)];
    const l = lettersList[Math.floor(Math.random() * lettersList.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    
    let numberStr = `${region} ${l} ${num}`;
    let price = 0;
    let rarity = "common";

    const rand = Math.random();

    // Սկզբնական ճկուն ու հավասարակշռված լոգիկա
    if (rand < 0.03) {
        const d = Math.floor(Math.random() * 9) + 1;
        numberStr = `${region} ${l} ${d}${d}${d}`;
        rarity = "legendary";
        price = Math.floor(Math.random() * 15000000) + 15000000; // 15Մ - 30Մ ֏
    } else if (rand < 0.10) {
        rarity = "mythic";
        price = Math.floor(Math.random() * 3000000) + 2000000; // 2Մ - 5Մ ֏
    } else if (rand < 0.25) {
        rarity = "epic";
        price = Math.floor(Math.random() * 1000000) + 1000000; // 1Մ - 2Մ ֏
    } else if (rand < 0.55) {
        rarity = "rare";
        price = Math.floor(Math.random() * 300000) + 200000; // 200Հ - 500Հ ֏
    } else {
        rarity = "common";
        price = Math.floor(Math.random() * 15000) + 5000; // 5Հ - 20Հ ֏
    }

    return { number: numberStr, price, rarity };
}

function spinNumber() {
    const spinCost = 30000;

    if (balance < spinCost) {
        alert("⚠️ Փողդ վերջացավ! (Ֆրցնելն արժե 30,000 ֏). Բացում եմ «Ֆրցրածներ» էջը՝ համարներդ վաճառելու համար:");
        switchTab('temporary');
        return;
    }

    balance -= spinCost;
    updateBalance();

    const plateBox = document.getElementById('mainPlateBox');
    const slotEl = document.getElementById('numberSlot');
    const badgeEl = document.getElementById('numberTypeBadge');
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.disabled = true;

    plateBox.className = "license-plate relative text-slate-950 px-3 py-4 md:py-5 flex items-center justify-between w-full plate-common spinning-animation";
    badgeEl.innerText = "🌀 Պտտվում է...";
    badgeEl.className = "mt-4 inline-block bg-slate-800 text-cyan-400 text-xs px-4 py-1.5 rounded-full font-medium border border-cyan-500/30 animate-pulse";

    let counter = 0;
    const interval = setInterval(() => {
        const rReg = regionCodes[Math.floor(Math.random() * regionCodes.length)];
        const rLet = lettersList[Math.floor(Math.random() * lettersList.length)];
        const rNum = Math.floor(Math.random() * 900) + 100;
        slotEl.innerText = `${rReg} ${rLet} ${rNum}`;
        counter++;
        
        if (counter > 15) {
            clearInterval(interval);
            
            const generated = generateArmenianCarNumber();
            slotEl.innerText = generated.number;
            
            plateBox.classList.remove('spinning-animation');
            plateBox.className = "license-plate relative text-slate-950 px-3 py-4 md:py-5 flex items-center justify-between w-full";

            if (generated.rarity === 'legendary' || generated.rarity === 'mythic' || generated.rarity === 'epic') {
                plateBox.classList.add('plate-big-flash', 'plate-rainbow-phase');
                
                setTimeout(() => {
                    plateBox.classList.remove('plate-big-flash', 'plate-rainbow-phase');
                    if (generated.rarity === 'legendary') plateBox.classList.add('plate-legendary');
                    else if (generated.rarity === 'mythic') plateBox.classList.add('plate-mythic');
                    else if (generated.rarity === 'epic') plateBox.classList.add('plate-epic');
                }, 1200);

            } else if (generated.rarity === 'rare') {
                plateBox.classList.add('plate-rare');
            } else {
                plateBox.classList.add('plate-common');
            }

            badgeEl.innerText = `Արժեքը՝ ${generated.price.toLocaleString()} ֏`;
            badgeEl.className = "mt-4 inline-block bg-slate-800 text-slate-200 text-xs px-4 py-1.5 rounded-full font-bold border border-slate-700 shadow";

            temporaryNumbers.push(generated);
            spinCount++;
            updateProgress();
            saveGame();

            spinBtn.disabled = false;
        }
    }, 45);
}

function updateProgress() {
    const currentMod = spinCount % 50;
    const isCompletedBlock = (spinCount > 0 && currentMod === 0);
    const displayMod = isCompletedBlock ? 50 : currentMod;
    
    const progressPercent = (displayMod / 50) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    document.getElementById('spinCounter').innerText = `${displayMod} / 50`;

    const clearBtn = document.getElementById('clearAllBtn');
    if (isCompletedBlock) {
        clearBtn.classList.remove('hidden');
    } else {
        clearBtn.classList.add('hidden');
    }
}

function clearAndSave() {
    if (myNumbers.length + temporaryNumbers.length > maxSlots) {
        alert("Պահոցումդ տեղ չկա այս 50 համարներն ավելացնելու համար: Կատարիր պրակաչկա!");
        return;
    }

    myNumbers.push(...temporaryNumbers);
    temporaryNumbers = []; 
    
    updateProgress();
    renderMyNumbers();
    saveGame();
    alert("✅ 50 ֆրցրած համարները հաջողությամբ պահպանվեցին քո պահոցում («Իմ Համարները» բաժին)!");
}

function updateBalance() {
    document.getElementById('balanceDisplay').innerText = balance.toLocaleString();
    saveGame();
}

function renderShop() {
    const shopContainer = document.getElementById('shopList');
    shopContainer.innerHTML = "";

    shopNumbers.forEach((item, index) => {
        let rarityBorder = "border-blue-900/40";
        if (item.rarity === 'legendary') rarityBorder = "border-amber-500/60 bg-amber-950/20";
        else if (item.rarity === 'mythic') rarityBorder = "border-rose-500/60 bg-rose-950/20";
        else if (item.rarity === 'epic') rarityBorder = "border-purple-500/60 bg-purple-950/20";

        shopContainer.innerHTML += `
            <div class="bg-slate-900/90 border ${rarityBorder} p-5 rounded-3xl flex justify-between items-center shadow-xl">
                <div>
                    <div class="text-xs text-blue-400 font-bold mb-1">Վաճառող՝ ${item.seller}</div>
                    <div class="text-xl md:text-2xl font-mono font-black text-cyan-300">${item.number}</div>
                    <div class="text-xs text-emerald-400 mt-1 font-extrabold">Գինը՝ ${item.price.toLocaleString()} ֏</div>
                </div>
                <button onclick="buyFromShop(${index})" class="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition shadow-lg active:scale-95">
                    Գնել
                </button>
            </div>
        `;
    });
}

function buyFromShop(index) {
    const item = shopNumbers[index];
    if (balance < item.price) {
        alert("Բալանսդ չի բավարարում:");
        return;
    }
    if (myNumbers.length >= maxSlots) {
        alert("Պահոցդ լցված է!");
        return;
    }

    balance -= item.price;
    updateBalance();
    myNumbers.push(item); 
    shopNumbers.splice(index, 1);
    renderShop();
    saveGame();
    alert("Հաջողությամբ գնվեց և ավելացվեց քո համարներին!");
}

function renderTemporaryNumbers() {
    const container = document.getElementById('temporaryList');
    container.innerHTML = "";

    if (temporaryNumbers.length === 0) {
        container.innerHTML = `<div class="col-span-2 text-center text-slate-500 py-12">Ֆրցրած համարներ չկան։ Գնա ֆրցնելու!</div>`;
        return;
    }

    temporaryNumbers.forEach((item, index) => {
        let borderGlow = "border-slate-800";
        if (item.rarity === 'legendary') borderGlow = "border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]";
        else if (item.rarity === 'mythic') borderGlow = "border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]";
        else if (item.rarity === 'epic') borderGlow = "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]";

        container.innerHTML += `
            <div onclick="openActionModal(${index})" class="bg-slate-900/90 border ${borderGlow} p-5 rounded-3xl flex justify-between items-center shadow-xl cursor-pointer transition transform active:scale-95">
                <div>
                    <div class="text-xs text-amber-400 font-bold mb-1">Արժեքը՝ ${item.price.toLocaleString()} ֏</div>
                    <div class="text-lg md:text-xl font-mono font-extrabold text-white">${item.number}</div>
                </div>
                <span class="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold">Սեղմել</span>
            </div>
        `;
    });
}

function sellAllTemporary() {
    if (temporaryNumbers.length === 0) {
        alert("Վաճառելու համարներ չկան:");
        return;
    }

    let totalEarned = 0;
    temporaryNumbers.forEach(item => {
        totalEarned += item.price;
    });

    balance += totalEarned;
    temporaryNumbers = [];
    updateBalance();
    renderTemporaryNumbers();
    saveGame();
    alert(`💰 Հաջողությամբ վաճառվեց բոլոր համարները։ Ստացար ${totalEarned.toLocaleString()} դրամ!`);
}

function openActionModal(index) {
    selectedTempIndex = index;
    const item = temporaryNumbers[index];
    document.getElementById('modalPlateNumber').innerText = item.number;
    document.getElementById('modalPlatePrice').innerText = `Գինը՝ ${item.price.toLocaleString()} ֏`;
    
    const modal = document.getElementById('actionModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeActionModal() {
    const modal = document.getElementById('actionModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    selectedTempIndex = null;
}

function actionSell() {
    if (selectedTempIndex !== null) {
        const item = temporaryNumbers[selectedTempIndex];
        balance += item.price;
        updateBalance();
        temporaryNumbers.splice(selectedTempIndex, 1);
        closeActionModal();
        renderTemporaryNumbers();
        saveGame();
        alert(`💰 Համարը հաջողությամբ վաճառվեց ${item.price.toLocaleString()} դրամով։`);
    }
}

function actionSave() {
    if (selectedTempIndex !== null) {
        if (myNumbers.length >= maxSlots) {
            alert("Պահոցդ լցված է! Կատարիր պրակաչկա!");
            return;
        }
        const item = temporaryNumbers[selectedTempIndex];
        myNumbers.push(item);
        temporaryNumbers.splice(selectedTempIndex, 1);
        closeActionModal();
        renderTemporaryNumbers();
        saveGame();
        alert("📥 Համարը հաջողությամբ պահպանվեց «Իմ Համարները» բաժնում։");
    }
}

function renderMyNumbers() {
    const container = document.getElementById('myNumbersList');
    container.innerHTML = "";
    document.getElementById('storageInfo').innerText = `Տեղեր: ${myNumbers.length} / ${maxSlots}`;

    if (myNumbers.length === 0) {
        container.innerHTML = `<div class="col-span-2 text-center text-slate-500 py-12">Դեռ պահպանված համարներ չկան։</div>`;
        return;
    }

    myNumbers.forEach((item, index) => {
        container.innerHTML += `
            <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl flex justify-between items-center shadow-xl">
                <div>
                    <div class="text-xs text-cyan-400 font-bold mb-1">Արժեքը՝ ${item.price.toLocaleString()} ֏</div>
                    <div class="text-lg md:text-xl font-mono font-extrabold text-white">${item.number}</div>
                </div>
                <div class="flex gap-2">
                    <button onclick="sellMyNumber(${index})" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition shadow-md active:scale-95">
                        Վաճառել (${item.price.toLocaleString()} ֏)
                    </button>
                    <button onclick="deleteMyNumber(${index})" class="bg-rose-950/50 hover:bg-rose-900 text-rose-300 text-xs px-3 py-2.5 rounded-xl transition border border-rose-900/50">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    });
}

function sellMyNumber(index) {
    const item = myNumbers[index];
    balance += item.price;
    updateBalance();
    myNumbers.splice(index, 1);
    renderMyNumbers();
    saveGame();
    alert(`Վաճառվեց ${item.price.toLocaleString()} դրամով։`);
}

function deleteMyNumber(index) {
    if (confirm("Հեռացնե՞լ համարը պահոցից։")) {
        myNumbers.splice(index, 1);
        renderMyNumbers();
        saveGame();
    }
}

function openUpgradeModal() {
    document.getElementById('upgradeModal').classList.remove('hidden');
    document.getElementById('upgradeModal').classList.add('flex');
    document.getElementById('modalCapacity').innerText = `${maxSlots} տեղ (Նորը՝ ${maxSlots + 50} տեղ)`;
    document.getElementById('upgradeCostDisplay').innerText = `${upgradeCost.toLocaleString()} ֏`;
}

function closeUpgradeModal() {
    document.getElementById('upgradeModal').classList.add('hidden');
    document.getElementById('upgradeModal').classList.remove('flex');
}

function buyUpgrade() {
    if (balance < upgradeCost) {
        alert("Բալանսդ չի բավարարում:");
        return;
    }
    balance -= upgradeCost;
    maxSlots += 50;
    upgradeCost *= 2;
    
    document.getElementById('maxSlotsDisplay').innerText = maxSlots;
    
    updateBalance();
    closeUpgradeModal();
    renderMyNumbers();
    saveGame();
    
    alert(`🎉 Հաջողությամբ կատարվեց պրակաչկա! Պահոցդ ընդլայնվեց և հիմա ունի ${maxSlots} տեղ (+50 տեղ ավելացավ):`);
}

document.getElementById('maxSlotsDisplay').innerText = maxSlots;
updateBalance();
updateProgress();