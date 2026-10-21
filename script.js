console.log('script chali');
const boxes =  document.querySelectorAll('input[type="checkbox"]');

const saved = JSON.parse(localStorage.getItem('checks')) || [];
boxes.forEach((box, i) => {
    box.checked = saved[i] || false;    
});

boxes.forEach((box, i) => {
    box.addEventListener('change', () => { 
    const state = Array.from(boxes).map((b) => b.checked);
    localStorage.setItem('checks', JSON.stringify(state));
    console.log('saved:', state.filter(Boolean).length);
    });
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}