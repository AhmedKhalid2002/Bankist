'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Ahmed khalid',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Mohammed Ali',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'fahd mohammed',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sara Khalid',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelbalanceIn = document.querySelector('.balancemary__value--in');
const labelbalanceOut = document.querySelector('.balancemary__value--out');
const labelbalanceInterest = document.querySelector(
  '.balancemary__value--interest'
);

const labelSumIn = document.querySelector('.summary__value--in');
const labelSumout = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');

const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

let inputLoginUsername = document.querySelector('.login__input--user');
let inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ``;

  const movs = sort ? movements.slice(' ').sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} €</div>
        </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};

createUserName(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((prev, next) => prev + next, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((move) => move > 0)
    .reduce((prev, next) => prev + next, 0);
  const outcome = acc.movements
    .filter((move) => move < 0)
    .reduce((prev, next) => prev + next, 0);

  const interest = acc.movements
    .filter((move) => move > 0)
    .map((deposite) => (deposite * acc.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((prev, next) => prev + next, 0);
  labelSumIn.textContent = `${income}€`;
  labelSumout.textContent = `${Math.abs(outcome)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const updateUi = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) =>
      acc.userName.toLowerCase() === inputLoginUsername.value.toLowerCase()
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAccount = accounts.find(
    (acc) => acc.userName.toLowerCase() === inputTransferTo.value.toLowerCase()
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    reciverAccount?.userName !== currentAccount?.userName &&
    currentAccount.balance >= amount &&
    reciverAccount
  ) {
    currentAccount.movements.push(-amount);
    reciverAccount.movements.push(amount);
    updateUi(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.userName.toLowerCase() ===
      inputCloseUsername.value.toLowerCase() &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName.toLowerCase() === currentAccount?.userName
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
});
let sorted=false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted=!sorted;
});
