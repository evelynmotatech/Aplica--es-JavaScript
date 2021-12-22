//REFERÊNCIAS DE ELEMENTOS DO DOM
const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : [];


const removeTransaction = ID => {
  transactions = transactions.filter(transaction => transaction.id !== ID);
  updateLocalStorage();
  init();
}

const addTransactionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-' : '+';
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass);
  li.innerHTML = `
    ${transaction.name} <span>${operator} R$${amountWithoutOperator} </span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button >
  `;

  transactionUl.append(li);
}

const updateBalanceValue = () => {

  const transactionAmounts = transactions
    .map(transaction => transaction.amount);

  const total = transactionAmounts
    .reduce((acc, transaction) => (acc += transaction), 0)
    .toFixed(2);

  const income = transactionAmounts
    .filter(value => value > 0)
    .reduce((acc, value) => (acc + value), 0)
    .toFixed(2);

  const expanse = Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((acc, value) => (acc + value), 0)
    .toFixed(2));

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expanse}`;
}

const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValue();
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

const genarateID = () => Math.round(Math.random() * 1000);

form.addEventListener('submit', event => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();

  if (transactionName === '' || transactionAmount === '') {
    alert('Preencha todos os campos, por favor!');
    return;
  }

  const transaction = {
    id: genarateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  }

  transactions.push(transaction);
  init();
  updateLocalStorage();

  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
});