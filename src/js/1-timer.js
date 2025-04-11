import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');

const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerIntervalId = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];
      if (selectedDate <= new Date()) {
        iziToast.error({
          title: 'Error',
          message: "Please choose a date in the future",
        });
          startButton.disabled = true;
      } else {
          userSelectedDate = selectedDate;
          startButton.disabled = false;
      }
    console.log(selectedDates[0]);
  },
};

flatpickr(dateTimePicker, options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6, minutes: 42, seconds: 20}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({days, hours, minutes, seconds}) {
    dataDays.textContent = addLeadingZero(days);
    dataHours.textContent = addLeadingZero(hours);
    dataMinutes.textContent = addLeadingZero(minutes);
    dataSeconds.textContent = addLeadingZero(seconds);
}

startButton.addEventListener('click', () => {
    if (!userSelectedDate) {
        return;
    }
    startButton.disabled = true;
    dateTimePicker.disabled = true;

    timerIntervalId = setInterval(() => {
        const now = new Date();
        const timeDifference = userSelectedDate - now;

        if (timeDifference <= 0) {
            clearInterval(timerIntervalId);
            updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            dateTimePicker.disabled = false;
            return;
        }
        const timerObject = convertMs(timeDifference);
        updateTimer(timerObject);
    }, 1000);


})