
// global variables
const transactionList = document.getElementById('ledger-table');
const newItemEl = document.getElementById('item');
const newAmountEl = document.getElementById('amount');
const currentBalanceEl = document.getElementById('account-balance');

function addItemDetail(detail) {
    let detailEl = document.createElement('td');

    if (typeof detail == 'object') {
        let dateEl = document.createElement('input');
        dateEl.type = 'date';
        dateString = detail.getFullYear().toString().padStart(4, '0');
        dateString = `${dateString}-${(detail.getMonth() + 1).toString().padStart(2, '0')}`;
        dateString = `${dateString}-${detail.getDate().toString().padStart(2, '0')}`;
        dateEl.value = dateString;
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
        transactionList.appendChild(newItem);

        const currentBalance = parseFloat(currentBalanceEl.innerText.slice(1));
        const newBalance = currentBalance + itemAmount;

        currentBalanceEl.innerText = `$${newBalance.toFixed(2)}`;

        newItemEl.value = '';
        newAmountEl.value = '';
    }
}
