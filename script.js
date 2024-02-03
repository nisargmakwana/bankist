'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  //username: js
  // password: 1111
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-10-19T14:11:59.604Z',
    '2023-10-20T17:01:17.194Z',
    '2023-10-21T23:36:17.929Z',
    '2023-10-23T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formattedCurrency = function (number) {
  return new Intl.NumberFormat(currentAccount.locale, {
    style: 'currency',
    currency: currentAccount.currency,
  }).format(number);
};

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
  const daysPassed = Math.round(calcDaysPassed(new Date(), date));
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // can omit else block because, the following code will only be executed if above three statements do not
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, currentAccount.locale);
    const formattedMov = formattedCurrency(mov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formattedCurrency(acc.balance);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formattedCurrency(incomes);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formattedCurrency(out);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formattedCurrency(interest);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const setLogoutTimer = function () {
  const tick = function () {
    // In each call, print the remaining time to the UI
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    //When 0s, stop the timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // Decrease 1s
    time -= 1;
  };
  // set time to 5 minutes
  let time = 120;
  // call the timer every second
  tick();
  timer = setInterval(tick, 1000);

  return timer;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// FAKE logged in (remove it once dev is done)
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting with API

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: 'numeric',
      // weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
    };

    // const locale = navigator.language;
    // console.log(locale);
    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const year = now.getFullYear();
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year}, ${hour}:${min}`;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if (timer) clearInterval(timer);
    setLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    setLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      setLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
console.log(23 === 23.0); //all numbers are converted to integers

// base 10 = 0 to 9
// binary base 2 - 0 1
console.log(0.1 + 0.2); //weird result of 0.30000000000000004
// js can't represent certain fractions like in above expression
console.log(0.1 + 0.2 === 0.3); // false

console.log(Number('23')); // 23
console.log(+'23'); // 23

// Parsing
console.log(Number.parseInt('30px', 10)); // 30 string has to start with a number
console.log(Number.parseInt('e23', 10)); // NaN

console.log(Number.parseFloat('  2.5rem')); // 2.5
console.log(Number.parseFloat('2.5rem    ')); // 2.5

// Checks if value is NaN
console.log(Number.isNaN(23)); // false
console.log(Number.isNaN('23')); // false
console.log(Number.isNaN(+'23X')); // true
console.log(Number.isNaN(23 / 0)); // false,  try 23/0 in console. gives infinity

// Best way of checking if value is a number
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite(+'20X')); // false
console.log(Number.isFinite(20 / 0)); // false

console.log(Number.isInteger(23)); //true
console.log(Number.isInteger(23.0)); //true
console.log(Number.isInteger(23 / 0)); //false
*/

/*
console.log(Math.sqrt(25)); // 5
console.log(25 ** (1 / 2)); // 5
console.log(125 ** (1 / 3)); // 4.999999999999999

console.log(Math.max(5, 18, 23, 11, 2)); // 23
console.log(Math.max(5, 18, '23', 11, 2)); // 23
console.log(Math.max(5, 18, 23, '11px', 2)); // NaN

console.log(Math.min(5, 18, 23, 11, 2)); // 2

console.log(Math.PI * Number.parseFloat('10px') ** 2); // 314.1592653589793 gives area of the circle

console.log(Math.trunc(Math.random() * 6) + 1); // random numbers from 1 to 6
console.log(Math.random()); // gives random numbers b/w 0 and 1
const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min)) + 1 + min; //function to get a random number b/w a range

console.log(randomInt(5, 10));

// Rounding integers
console.log(Math.trunc(23.3)); //23

console.log(Math.round(23.3)); // 23
console.log(Math.round(23.9)); // 24

console.log(Math.ceil(23.3)); // 24
console.log(Math.ceil(23.9)); // 24

console.log(Math.floor(23.3)); // 23
console.log(Math.floor('23.9')); // 23 these function does type coercion too

// floor and trunc are not the same
console.log(Math.floor(-22.9)); // -23
console.log(Math.trunc(-22.9)); // -22

// Rounding decimals
console.log((2.7).toFixed(0)); // 3 IMPORTANT: returns answer in string data type
console.log((2.7).toFixed(3)); // 2.700
console.log((2.345).toFixed(2)); // 2.35
console.log(+(2.345).toFixed(2)); //2.35 number data type
*/
/*
console.log(5 % 2); // 1
console.log(5 / 2); // 2.5

console.log(8 % 3); // 2
console.log(8 / 3); // 2.6666666666666665

console.log(6 % 2); // 0
console.log(6 / 2); // 3

console.log(7 % 2); // 1
console.log(7 / 2); // 3.5

const isEven = n => n % 2 === 0;
console.log(isEven(2)); // true
console.log(isEven(8)); // true
console.log(isEven(23)); // false

// applying this even odd logic to apply bg color to movements row in the app

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    if (i % 2 != 0) row.style.backgroundColor = 'blue';
  });
});
*/
/*
// Numeric Separator: ES-2021

const diameter = 2_87_46_00_00_000;
console.log(diameter); // 287460000000

const price = 345_99;
console.log(price); // 34599

const transferFee1 = 15_00;
const transferFee2 = 1_500; // both are same numbers

const PI = 3.1415; // can't place underscore in floating point values
console.log(PI);

console.log(Number('230_000')); // NaN
console.log(parseInt('230_000')); // 230
*/
/*
// Working with BigInt

// js stores numbers in 64 bits, out of which it uses 53 bits for numbers and rest for sign. That said, the heighest number that js can store is

console.log(2 ** 53 - 1); // 9007199254740991
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991

console.log(2 ** 53 + 1); // 9007199254740992
console.log(2 ** 53 + 2); // 9007199254740994
console.log(2 ** 53 + 3); // 9007199254740996
console.log(2 ** 53 + 4); // 9007199254740996
// observe inaccuracy in answers

console.log(4838430248342043823408394839483204); // 4.8384302483420437e+33
console.log(4838430248342043823408394839483204n); // 4838430248342043823408394839483204n (in green color)
console.log(BigInt(4838430248342043823408394839483204)); // 4838430248342043683707135006343168n (in green color)
//both above numbers are not the same. Maybe BigInt () works only with small numbers
console.log(BigInt(546124)); // 546124n

// Operations
console.log(10000n + 1000n); //works the same as int
console.log(32423543244543423601924344n * 10000000n); // 324235432445434236019243440000000n
// console.log(Math.sqrt(64n)); // doesn't work

const huge = 3534234134101020400n;
const num = 23;
// console.log(huge * num); // Error: cannot mix BigInt and other types
console.log(huge * BigInt(num)); // works 81287385084323469200n

console.log(20n > 15); // exception: this operator works true
console.log(20n === 20); // false
console.log(20n == 20); // true
console.log(typeof 20n); // bigint
console.log(huge + ' is REALLY big!!!'); //converts to a string

// Divisions
console.log(10n / 3n); // 3n cuts of the decimal part
console.log(10 / 3); // 3.3333333333333335
*/
/*
// Creating Dates

const now = new Date();
console.log(now); // Sat Oct 21 2023 13:07:12 GMT+0530 (India Standard Time)

console.log(new Date('Oct 21, 2023')); // Sat Oct 21 2023 00:00:00 GMT+0530 (India Standard Time)
// Date function can parse data from string and shows the date in the exact same format
console.log(new Date('Oct 21 2023 12:43:55')); // Sat Oct 21 2023 12:43:55 GMT+0530 (India Standard Time)
console.log(new Date(account1.movementsDates[0])); // Tue Nov 19 2019 03:01:17 GMT+0530 (India Standard Time)

console.log(new Date(2037, 10, 19, 15, 23, 5)); // Thu Nov 19 2037 15:23:05 GMT+0530 (India Standard Time)
//new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
// however, the month is printed Nov, that's because its zero-based, like indexing in arrays
console.log(new Date(2037, 10, 31)); // Tue Dec 01 2037 00:00:00 GMT+0530 (India Standard Time)
// no 31 days in november, hence it will automatically shift to 1st Dec

console.log(new Date(0)); // Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time)
// the amount of milliseconds passed since the beginning of the Unix time, which is January 1, 1970

console.log(new Date(3 * 24 * 60 * 60 * 1000)); // Sun Jan 04 1970 05:30:00 GMT+0530 (India Standard Time)
// 3 days amount of milliseconds passed since the beginning of the Unix time

// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future); // Thu Nov 19 2037 15:23:00 GMT+0530 (India Standard Time)
console.log(future.getFullYear()); // 2037
// tip: don't use getYear as it returns only 2 digits
console.log(future.getMonth()); // 10
console.log(future.getDate()); // 19
console.log(future.getDay()); // 4  (which is Thursday)
console.log(future.getHours()); // 15
console.log(future.getMinutes()); // 23
console.log(future.getSeconds()); // 0
console.log(future.toISOString()); // 2037-11-19T09:53:00.000Z (the formate jonas used in account object)
console.log(future.getTime()); // 2142237180000
// number of milliseconds passed since the beginning of the Unixtime
console.log(new Date(2142237180000)); // Thu Nov 19 2037 15:23:00 GMT+0530 (India Standard Time)

console.log(Date.now()); // 1697874653539
// timestamp in milliseconds

future.setFullYear(2040); // jumps to the same date in year 2040
console.log(future); // Mon Nov 19 2040 15:23:00 GMT+0530 (India Standard Time)
*/
/*
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future); // gives milliseconds passed since Jan 1, 1970

const calcDaysPassed = (date1, date2) =>
  Math.abs(+date2 - +date1) / (1000 * 60 * 60 * 24);
const days1 = calcDaysPassed(new Date(2037, 10, 14), new Date(2037, 10, 24));
console.log(days1);
*/
/*
const num = 34234234.232;
const options = {
  style: 'currency', //unit, percentage, currency... three options
  unit: 'mile-per-hour',
  currency: 'EUR',
  // useGrouping: false
};
console.log(`'US': ${new Intl.NumberFormat('en-US', options).format(num)}`);
console.log(
  `'Germany': ${new Intl.NumberFormat('de-De', options).format(num)}`
);
console.log(`'Syria': ${new Intl.NumberFormat('ar-SY', options).format(num)}`);
console.log(`'India': ${new Intl.NumberFormat('gu-IN', options).format(num)}`);
console.log(
  `'India': ${new Intl.NumberFormat(navigator.language, options).format(num)}`
);
*/
/*
// setTimeout
setTimeout(() => console.log('hello nisarg'), 3000); // 3000 is an argument here. can add multiple other arguments
setTimeout(
  (ing1, ing2) => console.log(`Your pizza is ready with ${ing1} and ${ing2}`),
  3000,
  'paneer',
  'spinach'
);
console.log('this will print first');

const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`your pizza is ready with ${ing1} and ${ing2}`),
  3000,
  ...ingredients
);
if (ingredients.includes('spinach')) {
  clearTimeout(pizzaTimer);
}


// setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 2500);

// challenge: clock on log
setInterval(function () {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(now);
  console.log(time);
}, 1000);
*/
