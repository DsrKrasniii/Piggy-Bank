
// global variables
const transactionListEl = document.getElementById('ledger-body');
const newItemEl = document.getElementById('item');
const newAmountEl = document.getElementById('amount');
const currentBalanceEl = document.getElementById('account-balance');
const ctxt = document.getElementById('chart').getContext('2d');
var chart = createChart();

function getOnlyUnique(value, index, list) {
    return list.indexOf(value) === index;
}

function addItemDetail(detail) {
    let detailEl = document.createElement('td');

    if (typeof detail == 'object') {
        let dateEl = document.createElement('input');
        dateEl.type = 'date';
        dateString = detail.getFullYear().toString().padStart(4, '0');
        dateString = `${dateString}-${(detail.getMonth() + 1).toString().padStart(2, '0')}`;
        dateString = `${dateString}-${detail.getDate().toString().padStart(2, '0')}`;
        dateEl.value = dateString;
        dateEl.addEventListener('change', () => {
            let dates = getDateList();
            let transactions = getTransactionList();
            let amounts = combineAmounts(transactions);
            updateChart(chart, dates, amounts);
        });
        detailEl.appendChild(dateEl);
    }
    else if (typeof detail == 'number') {
        detailEl.innerText = `$${detail.toFixed(2)}`;
    }
    else {
        detailEl.innerText = detail;
    }
    return detailEl;
}

function addLedgerItem(itemName, itemAmount) {
    let newItem = document.createElement('tr');
    let itemDate = new Date();
    [itemName, itemAmount, itemDate].forEach((d) => {
        newDetail = addItemDetail(d);
        newItem.appendChild(newDetail);
    });
    return newItem;
}

function addTransaction(sign) {
    const itemName = newItemEl.value;
    const itemAmount = parseFloat(newAmountEl.value) * sign;

    if (itemName && !isNaN(itemAmount)) {
        const newItem = addLedgerItem(itemName, itemAmount);
        transactionListEl.appendChild(newItem);

        const currentBalance = parseFloat(currentBalanceEl.value);
        const newBalance = currentBalance + itemAmount;

        currentBalanceEl.value = newBalance.toFixed(2);

        newItemEl.value = '';
        newAmountEl.value = '';

        let dates = getDateList();
        let transactions = getTransactionList();
        let amounts = combineAmounts(transactions);
        updateChart(chart, dates, amounts);
    }
    else {
        alert('invalid amount');
    }
}

function getDateList() {
    let newList = [];
    let children = Array.from(transactionListEl.children);
    let i = 1;
    children.forEach((child) => {
        if (children.length > 1 && i < children.length) {
            if (Date.parse(child.lastElementChild.lastElementChild.value) > Date.parse(children[i].lastElementChild.lastElementChild.value)) {
                transactionListEl.appendChild(transactionListEl.removeChild(child));
            }
            i += 1;
        }
    });
    children.forEach((child) => {
        newList.push(child.lastElementChild.lastElementChild.value);
    });
    return newList;
}

function getTransactionList() {
    let newList = [];
    let children = Array.from(transactionListEl.children);
    children.forEach((child) => {
        newList.push({
            date: child.lastElementChild.lastElementChild.value,
            amount: child.children[1].textContent
        });
    });
    return newList;
}

function combineAmounts(transactionList) {
    let amountList = [];
    let dateList = [];
    transactionList.forEach((obj) => {
        if (dateList.includes(obj.date)) {
            let index = dateList.indexOf(obj.date);
            amountList[index] = amountList.at(index) + Number(obj.amount.slice(1));
        }
        else {
            dateList.push(obj.date);
            amountList.push(Number(obj.amount.slice(1)));
        }
    });
    return amountList;
}

function createChart() {

    let data = {
        labels: [],
        datasets: [{
            data: [1, 2, 3],
            borderColor: 'blue',
            fill: false
        }]
    };

    let options = {
        responsive: true,
        maintainAspectRatio: false
    };

    return new Chart(ctxt, {
        type: 'line',
        data: data,
        options: options
    });
}

function updateChart(chart, dates, amounts) {
    chart.clear();
    let dateLabels = dates.filter(getOnlyUnique);
    chart.data.labels = dateLabels;
    chart.data.datasets[0].data = amounts;
    chart.update();
}
