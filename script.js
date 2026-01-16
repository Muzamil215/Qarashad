const validUsername = 'Muzamil';
const validPassword = 'Muzamil123!@#';


const loginSection = document.getElementById('loginSection');
const expensesSection = document.getElementById('expensesSection');
const loginForm = document.getElementById('loginForm');

const expenseForm = document.getElementById('expenseForm');
const clearBtn = document.getElementById('clearBtn');
const loginError = document.getElementById('loginError');
const expenseError = document.getElementById('expenseError');
const expenseSuccess = document.getElementById('expenseSuccess');
const expensesList = document.getElementById('expensesList');
const totalAmount = document.getElementById('totalAmount');


let expenses = [];


document.addEventListener('DOMContentLoaded', function() {
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    
    loadExpenses();
    
   
    displayExpenses();
    
   
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        validatePasswordComplexity(passwordInput.value);
    });
});


loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
  
    loginError.textContent = '';
    loginError.classList.remove('show');
    
    
    const passwordValidation = checkPasswordComplexity(password);
    if (!passwordValidation.isValid) {
        showLoginError(passwordValidation.message);
        return;
    }
    
    
    if (validateLogin(username, password)) {
        
        showExpensesSection();
    } else {
        
        showLoginError('Invalid username or password. Please try again.');
    }
});

expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    
    expenseError.textContent = '';
    expenseError.classList.remove('show');
    expenseSuccess.textContent = '';
    expenseSuccess.classList.remove('show');
    
    
    const expenseName = document.getElementById('expenseName').value.trim();
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    
    
    if (validateExpenseInput(expenseName, category, amount, date)) {
        
        addExpense(expenseName, category, amount, date);
        
       
        showExpenseSuccess('Expense added successfully!');
        
        
        expenseForm.reset();
        
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        
        
        displayExpenses();
    }
});


clearBtn.addEventListener('click', function() {
    expenseForm.reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    expenseError.textContent = '';
    expenseError.classList.remove('show');
    expenseSuccess.textContent = '';
    expenseSuccess.classList.remove('show');
});


function checkPasswordComplexity(password) {
    const errors = [];
    
    
    if (password.length < 12) {
        errors.push('Password must be at least 12 characters long.');
    }
    
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter.');
    }
    
    
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter.');
    }
    
    
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number.');
    }
    
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one symbol.');
    }
    
    if (errors.length > 0) {
        return {
            isValid: false,
            message: errors.join(' ')
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}


function validatePasswordComplexity(password) {
    
    const reqLength = document.getElementById('req-length');
    if (password.length >= 12) {
        reqLength.classList.add('requirement-met');
        reqLength.classList.remove('requirement-unmet');
    } else {
        reqLength.classList.add('requirement-unmet');
        reqLength.classList.remove('requirement-met');
    }
    
    
    const reqUppercase = document.getElementById('req-uppercase');
    if (/[A-Z]/.test(password)) {
        reqUppercase.classList.add('requirement-met');
        reqUppercase.classList.remove('requirement-unmet');
    } else {
        reqUppercase.classList.add('requirement-unmet');
        reqUppercase.classList.remove('requirement-met');
    }
    
    
    const reqLowercase = document.getElementById('req-lowercase');
    if (/[a-z]/.test(password)) {
        reqLowercase.classList.add('requirement-met');
        reqLowercase.classList.remove('requirement-unmet');
    } else {
        reqLowercase.classList.add('requirement-unmet');
        reqLowercase.classList.remove('requirement-met');
    }
    
    
    const reqNumber = document.getElementById('req-number');
    if (/[0-9]/.test(password)) {
        reqNumber.classList.add('requirement-met');
        reqNumber.classList.remove('requirement-unmet');
    } else {
        reqNumber.classList.add('requirement-unmet');
        reqNumber.classList.remove('requirement-met');
    }
    
    
    const reqSymbol = document.getElementById('req-symbol');
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        reqSymbol.classList.add('requirement-met');
        reqSymbol.classList.remove('requirement-unmet');
    } else {
        reqSymbol.classList.add('requirement-unmet');
        reqSymbol.classList.remove('requirement-met');
    }
}


function validateLogin(username, password) {
    if (username === validUsername && password === validPassword) {
        return true;
    }
    return false;
}


function validateExpenseInput(expenseName, category, amount, date) {
   
    if (expenseName === '') {
        showExpenseError('Expense name cannot be empty.');
        return false;
    }
    
    
    if (category === '') {
        showExpenseError('Please select a category.');
        return false;
    }
    
    
    if (isNaN(amount) || amount <= 0) {
        showExpenseError('Please enter a valid amount greater than 0.');
        return false;
    }
    
    
    if (date === '') {
        showExpenseError('Please select a date.');
        return false;
    }
    
    return true;
}


function addExpense(name, category, amount, date) {
    const expense = {
        id: Date.now(),
        name: name,
        category: category,
        amount: amount,
        date: date
    };
    
    expenses.push(expense);
    
    
    saveExpenses();
}


function displayExpenses() {
    
    expensesList.innerHTML = '';
    
    if (expenses.length === 0) {
        expensesList.innerHTML = '<p class="no-expenses">No expenses added yet. Add your first expense above.</p>';
    } else {
        
        const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedExpenses.forEach(function(expense) {
            const expenseItem = createExpenseItem(expense);
            expensesList.appendChild(expenseItem);
        });
    }
    
    
    updateTotal();
}


function createExpenseItem(expense) {
    const item = document.createElement('div');
    item.className = 'expense-item';
    
    const formattedDate = formatDate(expense.date);
    const formattedAmount = expense.amount.toFixed(2);
    
    item.innerHTML = `
        <div class="expense-item-header">
            <span class="expense-item-name">${escapeHtml(expense.name)}</span>
            <span class="expense-item-amount">$${formattedAmount}</span>
        </div>
        <div class="expense-item-details">
            <span class="expense-item-category">${escapeHtml(expense.category)}</span>
            <span>${formattedDate}</span>
        </div>
    `;
    
    return item;
}


function updateTotal() {
    const total = expenses.reduce(function(sum, expense) {
        return sum + expense.amount;
    }, 0);
    
    totalAmount.textContent = total.toFixed(2);
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


function showLoginSection() {
    loginSection.classList.remove('hidden');
    expensesSection.classList.add('hidden');
}


function showExpensesSection() {
    loginSection.classList.add('hidden');
    expensesSection.classList.remove('hidden');
}


function showLoginError(message) {
    loginError.textContent = message;
    loginError.classList.add('show');
}


function showExpenseError(message) {
    expenseError.textContent = message;
    expenseError.classList.add('show');
}


function showExpenseSuccess(message) {
    expenseSuccess.textContent = message;
    expenseSuccess.classList.add('show');
    
   
    setTimeout(function() {
        expenseSuccess.classList.remove('show');
    }, 3000);
}


function saveExpenses() {
    localStorage.setItem('truckerExpenses', JSON.stringify(expenses));
}


function loadExpenses() {
    const savedExpenses = localStorage.getItem('truckerExpenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
}
