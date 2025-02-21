import iziToast from './main.js';

const form = document.querySelector('.form');

form.addEventListener('submit', createPromise);

function createPromise(event) {
  event.preventDefault();

  const delay = Number(event.target.delay.value);
  const state = event.target.state.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
  promise
    .then(delay => {
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
        messageColor: '#fff',
        backgroundColor: '#59a10d',
        icon: '',
        iconColor: '#fff',
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
        messageColor: '#fff',
        backgroundColor: '#ef4040',
        icon: '',
        iconColor: '#fff',
        position: 'topRight',
      });
    });
}
