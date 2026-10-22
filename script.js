const WEEK = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const boxes = document.querySelectorAll('input[type="checkbox"]');
const sections = document.querySelectorAll('section');

const now = new Date();
// ---------- Daily Hadith ----------
const startOfYear = new Date(now.getFullYear(), 0, 0);
const dayOfYear = Math.floor((now - startOfYear) / 86400000);
const hadith = HADITH[dayOfYear % HADITH.length];
document.getElementById('hadith-text').textContent = hadith.text;
document.getElementById('hadith-ref').textContent = hadith.ref;
const todayDate = now.toDateString();
const todayName = WEEK[now.getDay()];

function dateKey(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}
const todayKey = dateKey(now);

function sectionOf(name) {
  return Array.from(sections).find(
    (s) => s.querySelector('h2').textContent.trim() === name
  );
}
const todaySection = sectionOf(todayName);

// --- ticks load (aaj ki date ho to) ---
const data = JSON.parse(localStorage.getItem('checks'));
let saved = [];
if (data && data.date === todayDate) {
  saved = data.state;
}
boxes.forEach((box, i) => {
  box.checked = saved[i] || false;
  box.disabled = !todaySection.contains(box);
});

// --- history ---
function saveHistory(done, total, percent) {
  const history = JSON.parse(localStorage.getItem('history')) || {};
  history[todayKey] = { done: done, total: total, percent: percent };
  localStorage.setItem('history', JSON.stringify(history));
}

function updateMonth() {
  const history = JSON.parse(localStorage.getItem('history')) || {};
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysPassed = now.getDate();

  let sum = 0;
  let tracked = 0;
  for (let d = 1; d <= daysPassed; d++) {
    const entry = history[dateKey(new Date(year, month, d))];
    if (entry) {
      sum += entry.percent;
      tracked++;
    }
  }
  const avg = Math.round(sum / daysPassed);
  const monthName = now.toLocaleString('en-US', { month: 'long' });

  document.getElementById('month-text').textContent =
    monthName + ': ' + avg + '% average (' + tracked + '/' + daysPassed + ' day tracked)';
}

// --- tracker ---
function updateTracker(shouldSave) {
  const tasks = Array.from(todaySection.querySelectorAll('input[type="checkbox"]'))
    .filter((cb) => !cb.closest('summary'));

  const done = tasks.filter((cb) => cb.checked).length;
  const percent = Math.round((done / tasks.length) * 100);

    document.getElementById('tracker-text').textContent = 'Today: ' + percent + '%';
  document.getElementById('tracker-fill').style.width = percent + '%';

  if (shouldSave) saveHistory(done, tasks.length, percent);
  updateMonth();
}

// --- day tabs ---
const tabsBox = document.getElementById('day-tabs');

function showDay(name) {
  sections.forEach((s) => {
    const sName = s.querySelector('h2').textContent.trim();
    s.style.display = sName === name ? 'block' : 'none';
  });
  tabsBox.querySelectorAll('button').forEach((b) => {
    b.classList.toggle('active', b.dataset.day === name);
  });
}

const weekOrder = WEEK.slice(1).concat(WEEK[0]); // Monday se Sunday
weekOrder.forEach((name) => {
  const btn = document.createElement('button');
  btn.textContent = name.slice(0, 3);
  btn.dataset.day = name;
  if (name === todayName) btn.classList.add('today');
  btn.addEventListener('click', () => showDay(name));
  tabsBox.appendChild(btn);
});

showDay(todayName);
updateTracker(false);

// --- tick change ---
boxes.forEach((box) => {
  box.addEventListener('change', () => {
    const state = Array.from(boxes).map((b) => b.checked);
    localStorage.setItem('checks', JSON.stringify({ date: todayDate, state: state }));
    updateTracker(true);
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// ---------- Food & Groom ----------
const FG = {
  "Fruits": ["Pineapple", "Apple", "Orange", "Papaya", "Guava", "Pomegranate", "Watermelon"],
  "Vegetables": ["Spinach", "Cauliflower", "Laukey", "Mushroom", "Kaddoo", "Cabbage", "Bhindi"],
  "Protein Foods": ["Chicken breast", "Eggs", "Paneer", "Dal", "Chana", "Curd"],
  "Healthy Drinks": ["Warm water", "Green tea", "Nimbu pani", "Coconut water"],
  
  "Chicken Salad Recipe": [
    "Ingredients: 150-200g Boiled chicken, capsicum, cucumber, tomato, onion, lemon & salt,",
    "1. Chicken ko namak-mirch ke saath boil ya pan mein cook karo",
    "2. Thanda hone par chhote tukde kar lo",
    "3. Sabzi barik kaat lo",
    "4. Sab ek bowl mein mila ke upar se nimbu nichod do"
  ],
  "Sprout Salad Recipe": [
    "Ingredients: 100-150g Boiled Moong Sprout, cucumber, tomato, onion, lemon & salt,",
    "1. Boiled Moong me Add karo Veggies",
    "2. Chaat masala add karo",
    "3. Sab ek bowl mein mila ke upar se nimbu nichod do"
  ],
  "Veg Salad Recipe": [
    "Ingredients: Cucumber, Tomato, Onion, Carrot, Capsicum,",
    "1. Barik Kaat lo sab",
    "2. Add Curd, Lemon & salt",
    "3. Sab ek bowl mein mila lo Olive Oil ke saath"
  ],
  "Soya-chunk Salad Recipe": [
    "Ingredients: 50g Curd, 50g Soya Chunk, cucumber, tomato, onion, Capsicum, lemon & salt,",
    "1. Boiled Soya Chunks me Add karo Veggies",
    "2. Curd add karo",
    "3. Sab ek bowl mein mila ke upar se nimbu nichod do"
  ],
  "Hair Care": ["Pumpkin seed oil — helps block DHT and is a silent performer", "Rosemary essential oil — mix it with coconut/almond oil before applying", "Bhringraj oil — an Ayurvedic OG for hair, known for supporting hair density", "Saw palmetto oil — a natural DHT blocker that not many people know about", "Kalonji oil — helps with scalp inflammation and dandruff-causing fungus",
  ],
  "Tooth Care": [
    "Ingredients:, 50g Fitkari, 10g Desi Mishri, 20g Haldi, 40g Laung, 80g Sendha namak",
    "1. make powder and cook on tawa till it become Ashes",
    "2. Add Mishri",
    "3. Add Haldi",
    "4. Add Roasted Laung",
    "5. Add Namak",
    "6. Make a Fine Powder",
    "7. Add Sarso ka tel for best results"
  ],
  "Eye care": [
    "Ingredient: 100g Chhoti ilaichi, 100g Sounf, 100g Badam, 50g kali Mirich, 50g misri",
    "1. make a fine Powder",
    "2. 1 TBSP in Morning, 1TBSP After Dinner",
    "3. Use Eyeglases while using Devices & dont stare screen continuosly",
  ],
  "Health Care": [
    "1. Foods for Muscle:",
    "Almonds, Chickpeas, Salmon, Spinach, Quinoa, Kidney Beans",
    "2. Foods for Brain:",
    "Walnut, Blueberry, Pumpkin Seeds, Fatty Fish, Dark Chocolate",
    "3. Foods for Skin:",
    "Paneer, Curd, Almonds, Sesame Seeds, Sardines, Fatty Fish, Orange, Tomato",
    "4. Foods for Testicles:",
    "Cranberries, Brazil Nuts, Salmon, Pumpkin Seeds, Almonds",
    "5. Foods for Heart:",
    "Olive oil, Salmon, Avocado, Garlic, Beets, Pomegranate, Blueberries, Chia Seeds",
    "6. Foods for Eyes:",
    "Spinach, Almonds, Carrot, Makhana, Moong Sprouts, Haldi, Sweet Potatao",
    "7. Foods for Lungs:",
    "Apple, Beetroot, Garlic, Red grapes, haldi, Ginger, Tulsi, Kale",
    "8. Foods for Stomach:",
    "Banana, Curd, Fennel Seeds, Papaya, Ajwain, Moong Dal, Lauki, Coriander seeds, Ginger, Jeera"
  ],
  "Healthy Munching": [
    "100g Pumpkin Seeds",
    "100g Chia Seeds",
    "100g Flax Seeds",
    "100g Sesame Seeds",
    "100g Watermelon Seeds",
    "100g Sunflower Seeds",
    "mix it well"
  ],
  "Laddoo recipe": [
    "Ingredients: Makhana 100g, Dates 250g, Jaggery 200g, Almonds 100g, Cashews 100g, Dry coconut 100g, Ghee 100g, Methi dana 50g, Gond 50g, Flax seeds 50g, Cardamom 5g, Nutmeg 1",
    "1. Makhana dry roast karo jab tak crispy ho",
    "2. Almond, cashew, coconut, flax seeds alag-alag medium flame pe roast karo",
    "3. Methi dana halka roast karke pees lo (sirf 1-2 tsp use karna)",
    "4. Gond ko ghee mein puff hone tak roast karo, thanda hone par crush karo",
    "5. Dates ka beej nikaal ke paste banao",
    "6. Jaggery ko 2-3 tsp ghee ke saath halka gaadha hone tak pighlao",
    "7. Sab mix karke laddoo banao",
    "8. Air tight container mein rakho"
  ],
};

const fgModal = document.getElementById('fg-modal');
const fgMenu = document.getElementById('fg-menu');
const fgList = document.getElementById('fg-list');
const fgTitle = document.getElementById('fg-title');
const fgBack = document.getElementById('fg-back');

function fgShowMenu() {
  fgTitle.textContent = 'Food & Groom';
  fgMenu.hidden = false;
  fgList.hidden = true;
  fgBack.hidden = true;
}

function fgShowList(name) {
  fgList.innerHTML = '';
  FG[name].forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    fgList.appendChild(li);
  });
  fgTitle.textContent = name;
  fgMenu.hidden = true;
  fgList.hidden = false;
  fgBack.hidden = false;
}

Object.keys(FG).forEach((name) => {
  const btn = document.createElement('button');
  btn.textContent = name;
  btn.addEventListener('click', () => fgShowList(name));
  fgMenu.appendChild(btn);
});

document.getElementById('fg-open').addEventListener('click', () => {
  fgModal.hidden = false;
  fgShowMenu();
});
document.getElementById('fg-close').addEventListener('click', () => {
  fgModal.hidden = true;
});
fgBack.addEventListener('click', fgShowMenu);
fgModal.addEventListener('click', (e) => {
  if (e.target === fgModal) fgModal.hidden = true;
});

// ---------- Diet Calculator ----------
const CALC_IDS = ['height', 'weight', 'target', 'age', 'gender', 'activity'];
const cEl = (id) => document.getElementById('c-' + id);

// pichli values wapas bharo
const cSaved = JSON.parse(localStorage.getItem('calc')) || {};
CALC_IDS.forEach((id) => {
  if (cSaved[id] !== undefined) cEl(id).value = cSaved[id];
});

function calcDiet() {
  const h = parseFloat(cEl('height').value);
  const w = parseFloat(cEl('weight').value);
  const t = parseFloat(cEl('target').value);
  const age = parseFloat(cEl('age').value);
  const gender = cEl('gender').value;
  const act = parseFloat(cEl('activity').value);
  const out = document.getElementById('c-result');
  out.hidden = false;

  if (!(h > 0 && w > 0 && t > 0 && age > 0)) {
    out.innerHTML = '<p class="c-warn">Height, weight, target aur age sahi daalo.</p>';
    return;
  }

  const vals = {};
  CALC_IDS.forEach((id) => (vals[id] = cEl(id).value));
  localStorage.setItem('calc', JSON.stringify(vals));

  // Mifflin-St Jeor
  const bmr = 10 * w + 6.25 * h - 5 * age + (gender === 'male' ? 5 : -161);
  const tdee = bmr * act;

  let goal = 'Maintain';
  let adj = 0;
  if (t < w - 0.5) { goal = 'Weight loss'; adj = -500; }
  else if (t > w + 0.5) { goal = 'Weight gain'; adj = 300; }

  const floor = Math.max(bmr, gender === 'male' ? 1500 : 1200);
  const cal = Math.round(Math.max(tdee + adj, floor) / 10) * 10;

  const refW = goal === 'Weight loss' ? t : w;
  const protein = Math.round(1.8 * refW);
  const fat = Math.round((cal * 0.25) / 9);
  const carbs = Math.max(0, Math.round((cal - protein * 4 - fat * 9) / 4));
  const fiber = Math.max(25, Math.round((cal / 1000) * 14));
  const water = (0.035 * w).toFixed(1);

  // time estimate (7700 kcal ~ 1 kg)
  const weekly = ((cal - tdee) * 7) / 7700;
  let timeLine = '';
  if (goal !== 'Maintain' && Math.abs(weekly) > 0.05) {
    const weeks = Math.ceil(Math.abs(t - w) / Math.abs(weekly));
    timeLine = 'Andaza: ~' + Math.abs(weekly).toFixed(2) + ' kg/week, target tak ~' + weeks + ' hafte.';
  }

  const bmiTarget = t / ((h / 100) * (h / 100));
  const warn = bmiTarget < 18.5
    ? '<p class="c-warn">Target weight ka BMI ' + bmiTarget.toFixed(1) + ' hai, jo kam hai. Target dobara check karo ya doctor/dietitian se pooch lo.</p>'
    : '';

  out.innerHTML =
    '<div class="c-cards">' +
      '<div class="c-card"><b>' + cal + '</b><span>Calories / day</span></div>' +
      '<div class="c-card"><b>' + protein + ' g</b><span>Protein</span></div>' +
      '<div class="c-card"><b>' + carbs + ' g</b><span>Carbs</span></div>' +
      '<div class="c-card"><b>' + fat + ' g</b><span>Fats</span></div>' +
      '<div class="c-card"><b>' + fiber + ' g</b><span>Fiber</span></div>' +
      '<div class="c-card"><b>' + water + ' L</b><span>Water</span></div>' +
    '</div>' +
    '<p class="c-note">Goal: ' + goal + ' | BMR: ' + Math.round(bmr) + ' | Maintenance: ' + Math.round(tdee) + ' kcal<br>' + timeLine + '</p>' +
    warn +
    '<p class="c-note">Ye ek andaza hai (Mifflin-St Jeor formula). 2-3 hafte track karke dekho, weight na badle to calories thodi adjust karo.</p>';
}

document.getElementById('c-go').addEventListener('click', calcDiet);

document.getElementById('c-reset').addEventListener('click', () => {
  ['height', 'weight', 'target', 'age'].forEach((id) => (cEl(id).value = ''));
  cEl('gender').value = 'male';
  cEl('activity').value = '1.55';
  localStorage.removeItem('calc');
  const out = document.getElementById('c-result');
  out.hidden = true;
  out.innerHTML = '';
});
