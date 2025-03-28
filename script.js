'use strict';
//   THIS IS MY VERSION OF CODE WRITTEN WHILE WATCHING THE CODE
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;
  mov.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} withdrawal
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">${mov} €</div>
          </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumlator, value) => accumlator + value,
    0
  );
  labelBalance.textContent = `${acc.balance} €`;
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(value => value > 0)
    .reduce((accumlator, sum) => accumlator + sum, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(value => value < 0)
    .reduce((accumlator, sum) => accumlator + sum, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(value => value > 0)
    .map(value => (value * acc.interestRate) / 100)
    .reduce((accumlator, value) => accumlator + value, 0);
  labelSumInterest.textContent = `${interest}€`;
};

// calcDisplaySummary(account1.movements);

const createUserName = function (accounts) {
  accounts.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(letter => letter[0])
        .join(''))
  );
};
createUserName(accounts);

const updateUI = function (acc) {
  // Display summary
  calcDisplaySummary(acc);
  // Display Total Balance
  calcDisplayBalance(acc);
  // Display movements/transactions
  displayMovements(acc.movements);
};

// Event Handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  // stop page from refreshing
  e.preventDefault();
  // get the amount and username of receiver
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // check if transfer money is >0
  //check if the receiver exist
  //if your balance is greater than or equal to money u want to send
  // check if you're not sending to your self
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log(currentAccount.movements, receiverAcc.movements);
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const requestAmount = Number(inputLoanAmount.value);
  const loanEligibility =
    requestAmount > 0 &&
    currentAccount.movements.some(mov => mov >= 0.1 * requestAmount);
  if (loanEligibility) {
    currentAccount.movements.push(requestAmount);
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// To preserve the state we use sorted
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  // after changing we set back to normal
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

const arr = [1, 2, 3, 4, 5, 6];

// console.log(arr.splice(0, 2));

const arr2 = ['j', 'k', 'l', 'z', 'g', 'h'];

// console.log(arr2.join('*****'));

// Getting last element from an array
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// FOR EACH

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) console.log(`You deposited ${movement} to your account`);
//   else console.log(`You debited ${Math.abs(movement)} from your account`);
// }
// console.log('*'.repeat(30));
// movements.forEach(function (amount, NULL, ar) {
//   if (amount > 0)
//     console.log(`You deposited ${amount} to your account at  from ${ar}`);
//   else console.log(`You debited ${Math.abs(amount)} from your account`);
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const eurToUsd = 1.1;
const movementsUSD = movements.map(move => move * eurToUsd);

const movementDescription = movements.map(
  (move, i) =>
    `Movement ${i + 1}: You ${move > 0 ? 'deposited' : 'withdrawn'} ${Math.abs(
      move
    )}`
);

const deposits = movements.filter(value => value > 0);
// console.log(deposits);

const withdrawals = movements.filter(value => value < 0);
// console.log(withdrawals);

// finding maximum using reduce
const balance = movements.reduce(
  (acc, value, i, arr) => (acc > value ? acc : value),
  movements[0]
);
// console.log(balance);

const totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositUSD);

// Using FIND
const firstWithdrawal = movements.find(move => move < 0);
// console.log(firstWithdrawal);

// const account = accounts.find(account => account.owner === 'Jessica Davis');
// console.log(account);

// Using for-of loop
// let account;
// for (const mov of accounts) {
//   if (mov.owner === 'Jessica Davis') account = mov;
// }

// console.log(account);

const lastWithdrawal = movements.findLastIndex(mov => mov < 0);

// Some: condition
const anyDeposits = movements.some(Element => Element > 0);
// console.log(anyDeposits);

// Every: condition
// const vals = [1, 2, 3];
// console.log(vals.every(ele => ele > 0));

// Flat
const vals = [[1, 2], [3, 4], 5];
// console.log(vals.flat());

// Flat example
// console.log(
//   accounts
//     .map(acc => acc.movements)
//     .flat()
//     .reduce((acc, sum) => acc + sum, 0)
// );

const owners = ['jonas', 'zach', 'adam', 'martha'];
// console.log(owners.sort());

// Ascending
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
// console.log(movements);

const arrValues = [1, -9, 8, -55, 6, 1, 8, -30];

const arrGroups = Object.groupBy(arrValues, value =>
  value > 0 ? 'positive' : 'negative'
);

// console.log(arrGroups);

const groupedAccounts = Object.groupBy(accounts, type => type);
// console.log(groupedAccounts);

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(transaction => transaction > 0);
// .reduce((transaction, total) => transaction + total, 0);
// console.log(bankDepositSum);

const countDeposits = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// .filter(transaction => transaction > 0)

// console.log(countDeposits);

const sums = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

// console.log(deposits, withdrawals);

const convertTitleCase = function (title) {
  const expectations = ['a', 'an', 'the', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      expectations.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  // console.log(titleCase);
};
convertTitleCase('this is a nice Title');
