// UI inputs
const amount = document.getElementById('amount');
const interest = document.getElementById('interest');
const yearsRepay = document.getElementById('years');
// UI outputs
const monthlyPayment = document.getElementById('monthly-payment');
const totalPayment = document.getElementById('total-payment');
const totalInterest = document.getElementById('total-interest');
const comparisonArray = [];
const loanCalcObject = {
    index: 0,
    loanBorrow: 0,
    loanRate: 0,
    loanYears: 0,
    paymentMonthly: 0,
    paymentTotal: 0,
    paymentInterest: 0
}

loadEventListeners();

function loadEventListeners(){
    amount.valueAsNumber = 0;
    interest.valueAsNumber = 0;
    yearsRepay.valueAsNumber = 0;
    monthlyPayment.valueAsNumber = 0;
    totalPayment.valueAsNumber = 0;
    totalInterest.valueAsNumber = 0;

    // Listen for submit
    document.getElementById('loan-form').addEventListener('submit', function(e){
        // hide result
        document.getElementById('results').style.display = 'none';
        // show loader
        document.getElementById('loading').style.display = 'block';

        setTimeout(calculateResults, 1500);

        e.preventDefault();
    });
    // clear
    document.getElementById('clear').addEventListener('click', clearBtnFunction);
}


function clearBtnFunction(){
    location.reload();
}

function calculateResults(){
    // loan formula
    const principal = parseFloat(amount.valueAsNumber);
    const calculatedInterest = parseFloat(interest.valueAsNumber) / 100 / 12;
    const calculatedPayment = parseFloat(yearsRepay.valueAsNumber) * 12;
    // Compute monthly payment
    const x = Math.pow(1 + calculatedInterest, calculatedPayment);
    const monthly = (principal*x*calculatedInterest)/(x-1);
    
    // resultBoxMonthlyPayment = [(inputBoxBorrow*[(1 + (intputBoxInterestRate / 100 / 12)) ^ intputBoxYears * 12]*(intputBoxInterestRate / 100 / 12))/([(1 + (intputBoxInterestRate / 100 / 12)) ^ [intputBoxYears * 12]-1)]
    // resultBoxTotalLoanPayment = [(inputBoxBorrow*[(1 + (intputBoxInterestRate / 100 / 12)) ^ intputBoxYears * 12]*(intputBoxInterestRate / 100 / 12))/(x-1)] * (intputBoxYears * 12)
    // resultBoxTotalInterest  = ([(inputBoxBorrow*[(1 + (intputBoxInterestRate / 100 / 12)) ^ [intputBoxYears * 12]*(intputBoxInterestRate / 100 / 12))/([(1 + (intputBoxInterestRate / 100 / 12)) ^ [intputBoxYears * 12]-1)] * [intputBoxYears * 12]) - inputBoxBorrow
    // check find
    if(isFinite(monthly)){
        monthlyPayment.valueAsNumber = monthly.toFixed(2);
        totalPayment.valueAsNumber = (monthly * calculatedPayment).toFixed(2);
        totalInterest.valueAsNumber = ((monthly * calculatedPayment) - principal).toFixed(2);

        // save values for table
        var saveLoan = Object.create(loanCalcObject);
        saveLoan.index = comparisonArray.length;
        saveLoan.loanBorrow = principal;
        saveLoan.loanRate = parseFloat(interest.valueAsNumber);
        saveLoan.loanYears = parseFloat(yearsRepay.valueAsNumber);
        saveLoan.paymentMonthly = monthlyPayment.valueAsNumber;
        saveLoan.paymentTotal = totalPayment.valueAsNumber;
        saveLoan.paymentInterest = totalInterest.valueAsNumber;
        comparisonArray.push(saveLoan);
        // show table
        const tableBody = document.getElementById('comparisonTable')
        const tableRow = document.createElement('tr')
        const tableHeader = document.createElement('th')
        const tableData1 = document.createElement('td');
        const tableData2 = document.createElement('td');
        const tableData3 = document.createElement('td');
        const tableData4 = document.createElement('td');
        const tableData5 = document.createElement('td');
        const tableData6 = document.createElement('td');
        // console.log(saveLoan);
        tableHeader.innerText = saveLoan.index + 1;
        tableData1.innerText = saveLoan.loanBorrow;
        tableData2.innerText = saveLoan.loanRate;
        tableData3.innerText = saveLoan.loanYears;
        tableData4.innerText = saveLoan.paymentMonthly;
        tableData5.innerText = saveLoan.paymentInterest;
        tableData6.innerText = saveLoan.paymentTotal;
        tableRow.appendChild(tableHeader);
        tableRow.appendChild(tableData1);
        tableRow.appendChild(tableData2);
        tableRow.appendChild(tableData3);
        tableRow.appendChild(tableData4);
        tableRow.appendChild(tableData5);
        tableRow.appendChild(tableData6);
        tableBody.appendChild(tableRow);
        // show result
        document.getElementById('results').style.display = 'block';
        // hide loader
        document.getElementById('loading').style.display = 'none';
    } else {
        showError('Error!  Please insert all the information above');
    }
}

// Show error
function showError(error){
    // hide result
    document.getElementById('results').style.display = 'none';
    // hide loader
    document.getElementById('loading').style.display = 'none';
    // create a div
    const errorDiv = document.createElement('div');

    // get elements
    const card = document.querySelector('.card');
    const heading = document.querySelector('#results');

    // Add class
    errorDiv.className = 'alert alert-danger';

    // Create text node and append to div
    errorDiv.appendChild(document.createTextNode(error));

    // Insert error above heading
    card.insertBefore(errorDiv, heading);

    // clear error after 3 seconds
    setTimeout(clearError, 3000);
}

function clearError(){
    document.querySelector('.alert').remove();
}