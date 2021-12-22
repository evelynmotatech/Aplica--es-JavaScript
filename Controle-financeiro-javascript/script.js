//REFERÊNCIAS DE ELEMENTOS DO DOM
const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

//ARMAZENA AS TRANSACOES NO LOCAL STORAGE
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

//ARMAZENA AS TRANSACOES NO LOCALSTORAGE OU UMA ARRAY VAZIA
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : [];

//REMOVE TRANSACAO DO ARRAY E DO LOCAL STORAGE COM BASE EM SEU ID
const removeTransaction = ID => {
  transactions = transactions.filter(({
    id
  }) => id !== ID);
  //ATUALIZA O LOCALSTORAGE E INICIA A LISTA DE TRANSACOES
  updateLocalStorage();
  init();
}

//ADICIONA CLASSES AS TRANSAÇOES RECEBIDAS NO INPUT COM BASE NO VALOR
const addTransactionIntoDOM = ({amount, name, id}) => {
  const operator = amount < 0 ? '-' : '+';
  const CSSClass = amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(amount);
  //CRIA O ELEMENTO LI
  const li = document.createElement('li');
  //ADICIONA A CLASSE AO ELEMENTO LI E DEFINE SUA ESTRUTURA HTML
  li.classList.add(CSSClass);
  li.innerHTML = `
    ${name} <span>${operator} R$${amountWithoutOperator} </span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button >
  `;
  //ADICIONA O ELEMENTO LI AO UL
  transactionUl.append(li);
}

//ARMAZENA A SOMA DAS DESPESAS
const getExpenses = transactionAmounts =>
  Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((acc, value) => (acc + value), 0)
    .toFixed(2));

//ARMAZENA A SOMA DAS ENTRADAS
const getIncome = transactionAmounts => transactionAmounts
  .filter(value => value > 0)
  .reduce((acc, value) => (acc + value), 0)
  .toFixed(2);

//ARMAZENA A SOMA TOTAL DE TODAS AS TRANSACOES
const getTotal = transactionAmounts => transactionAmounts
  .reduce((acc, transaction) => (acc += transaction), 0)
  .toFixed(2);

//ATUALIZA O VALOR DAS DESPESAS, ENTRADAS E TOTAL NO DOM.
const updateBalanceValue = () => {
  const transactionAmounts = transactions
    .map(({
      amount
    }) => amount);

  const total = getTotal(transactionAmounts);
  const income = getIncome(transactionAmounts);
  const expanse = getExpenses(transactionAmounts);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expanse}`;
}

//INICIA A LISTA DE TRANSACOES
const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);
  updateBalanceValue();
}
init();

//GERA UM ID ALEATORIO PARA CADASTRAR A TRANSACAO
const genarateID = () => Math.round(Math.random() * 1000);

//ATUALIZA O LOCAL STORAGE
const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

//CRIA A TRANSACAO E ADICIONA AO ARRAY DE TRANSACAO
const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: genarateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  })
}

//LIMPA OS INPUTS
const cleanInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
}

//EVENTO DE SUBMIT DO FORMULARIO
const handleFormSubmit = event => {
  //PREVINE QUE O FORM SEJA ENVIADO E A PÁGINA SEJA RECARREGADA
  event.preventDefault();

  //VALORES INSERIDOS NO INPUT SEM ESPAÇOS EM BRANCO
  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();

  //VERIFICA SE ALGUM INPUT ESTÁ VAZIO
  const isSomeInputEmpty = transactionName === '' || transactionAmount === '';
  if (isSomeInputEmpty) {
    alert('Preencha todos os campos, por favor!');
    return;
  }

  //CHAMA A FUNÇÃO PARA ADICIONAR A TRANSACAO
  addToTransactionsArray(transactionName, transactionAmount);

  //CHAMAR A FUNÇÃO PARA ATUALIZA O LOCAL STORAGE E LIMPAR INPUTS
  init();
  updateLocalStorage();
  cleanInputs();
}

//CRIA O EVENTO DE SUBMIT AO BOTÃO E ACIONA A FUNÇÃO HANDLEFORMSUBMIT
form.addEventListener('submit', handleFormSubmit);