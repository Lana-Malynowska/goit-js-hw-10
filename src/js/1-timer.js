import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from './main.js';

const refs = {
  dateInput: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;

let userSelectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    console.log(selectedDates[0]);
    userSelectedDate = selectedDates[0];

    if (userSelectedDate.getTime() < Date.now()) {
      refs.startBtn.disabled = true;
      iziToast.error({
        title: '',
        message: 'Please choose a date in the future',
        messageColor: '#fff',
        icon: '',
        backgroundColor: '#ef4040',
        position: 'topRight',
      });
    } else {
      refs.startBtn.disabled = false;
      refs.dateInput.disabled = true;
    }
  },
};

let fp = flatpickr('#datetime-picker', options);

const timer = {
  intervalId: null,

  start() {
    if (!userSelectedDate) return;

    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    refs.dateInput.disabled = true;
    refs.startBtn.disabled = true;

    fp.destroy();
  },

  stop() {
    refs.dateInput.disabled = false;
    refs.startBtn.disabled = true;
    clearInterval(this.intervalId);

    updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    fp = flatpickr('#datetime-picker', options);
  },

  tick() {
    if (!userSelectedDate) return;

    const ms = userSelectedDate.getTime() - Date.now();
    if (ms <= 0) {
      this.stop();
      return;
    }
    updateTimerDisplay(convertMs(ms));
  },
};

refs.startBtn.addEventListener('click', () => {
  if (timer.intervalId) return;
  timer.start();
});

//  ==============================================
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
// ===============================================

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
