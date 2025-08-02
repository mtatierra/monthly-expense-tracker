// Get the form and table body
const form = document.getElementById("add-expense-form");
const expenseTableBody = document.querySelector("#expenses-table tbody");

let categoryChart, nameChart; // chart instances

// Handle form submit
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const name = document.getElementById("name").value;

  if (!date || !description || !amount || !category || !name) {
    alert("Please fill in all fields.");
    return;
  }

  const expense = {
    date,
    description,
    amount: parseFloat(amount),
    category,
    name,
  };

  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  addExpenseToTable(expense);
  updateSummary();
  form.reset();
});

// Add expense row to table
function addExpenseToTable(expense) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${expense.date}</td>
    <td>${expense.description}</td>
    <td>₱${expense.amount.toFixed(2)}</td>
    <td>${expense.category}</td>
    <td>${expense.name}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  row.querySelector(".delete-btn").addEventListener("click", function () {
    row.remove();
    deleteExpenseFromStorage(expense);
    updateSummary();
  });

  expenseTableBody.appendChild(row);
}

// Remove expense from localStorage
function deleteExpenseFromStorage(targetExpense) {
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses = expenses.filter(
    (exp) =>
      !(
        exp.date === targetExpense.date &&
        exp.description === targetExpense.description &&
        exp.amount === targetExpense.amount &&
        exp.category === targetExpense.category &&
        exp.name === targetExpense.name
      )
  );
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateSummary() {
  const nameSummary = {};
  const categorySummary = {};
  let grandTotal = 0;

  const rows = document.querySelectorAll("#expenses-table tbody tr");
  rows.forEach((row) => {
    const amount = parseFloat(row.children[2].textContent.replace("₱", ""));
    const category = row.children[3].textContent;
    const name = row.children[4].textContent;

    grandTotal += amount;

    if (!nameSummary[name]) nameSummary[name] = 0;
    nameSummary[name] += amount;

    if (!categorySummary[category]) categorySummary[category] = 0;
    categorySummary[category] += amount;
  });

  // Render summaries
  const nameOutput = document.getElementById("summary-by-name");
  const categoryOutput = document.getElementById("summary-by-category");

  nameOutput.innerHTML = "<h3>By Name</h3>";
  for (const name in nameSummary) {
    const p = document.createElement("p");
    p.textContent = `${name}: ₱${nameSummary[name].toFixed(2)}`;
    nameOutput.appendChild(p);
  }

  categoryOutput.innerHTML = "<h3>By Category</h3>";
  for (const category in categorySummary) {
    const p = document.createElement("p");
    p.textContent = `${category}: ₱${categorySummary[category].toFixed(2)}`;
    categoryOutput.appendChild(p);
  }

  const grandTotalEl = document.createElement("p");
  grandTotalEl.innerHTML = `<strong>Grand Total: ₱${grandTotal.toFixed(
    2
  )}</strong>`;
  categoryOutput.appendChild(grandTotalEl);

  updateCharts(categorySummary, nameSummary);

  const budget = JSON.parse(localStorage.getItem("monthlyBudget")) || {
    claire: 0,
    marbs: 0,
    total: 0,
  };
  document.getElementById("budget-total-display").textContent = `₱${(
    budget.claire + budget.marbs
  ).toFixed(2)}`;

  const claireSpent = nameSummary["Claire"] || 0;
  const marbsSpent = nameSummary["Marbs"] || 0;
  const totalSpent = claireSpent + marbsSpent;

  const budgetOutput = document.getElementById("budget-summary-output");

  const claireOver = claireSpent > budget.claire;
  const marbsOver = marbsSpent > budget.marbs;
  const totalOver = totalSpent > budget.claire + budget.marbs;

  budgetOutput.innerHTML = `
    <p style="color:${claireOver ? "red" : "inherit"}">
      Claire Budget: ₱${budget.claire.toFixed(
        2
      )} - Spent: ₱${claireSpent.toFixed(2)}
    </p>
    <p style="color:${marbsOver ? "red" : "inherit"}">
      Marbs Budget: ₱${budget.marbs.toFixed(2)} - Spent: ₱${marbsSpent.toFixed(
    2
  )}
    </p>
    <p style="color:${totalOver ? "red" : "inherit"}">
      Overall Budget: ₱${(budget.claire + budget.marbs).toFixed(
        2
      )} - Spent: ₱${totalSpent.toFixed(2)}
    </p>
  `;
}

function updateCharts(categorySummary, nameSummary) {
  if (categoryChart) categoryChart.destroy();
  if (nameChart) nameChart.destroy();

  const categoryLabels = Object.keys(categorySummary);
  const categoryData = Object.values(categorySummary);
  const ctx1 = document.getElementById("categoryChart").getContext("2d");
  categoryChart = new Chart(ctx1, {
    type: "pie",
    data: {
      labels: categoryLabels,
      datasets: [
        {
          data: categoryData,
          backgroundColor: [
            "#f44336",
            "#2196f3",
            "#4caf50",
            "#ff9800",
            "#9c27b0",
            "#00bcd4",
            "#ffc107",
          ],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });

  const nameLabels = Object.keys(nameSummary);
  const nameData = Object.values(nameSummary);
  const ctx2 = document.getElementById("nameChart").getContext("2d");
  nameChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: nameLabels,
      datasets: [
        {
          label: "Total by Name",
          data: nameData,
          backgroundColor: "#4caf50",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  expenses.forEach(addExpenseToTable);
  updateSummary();
});
