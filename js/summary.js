// summary.js
import { getMonthlyBudgetFromFirestore } from "./storage.js";

let categoryChart, nameChart;

export async function updateSummary(expenses = null) {
  const nameSummary = {};
  const categorySummary = {};
  let grandTotal = 0;

  // If expenses are passed (e.g., filtered), use them. Otherwise, scan DOM rows.
  const rows = expenses
    ? expenses.map((exp) => ({
        ...exp,
        amount: parseFloat(exp.amount),
      }))
    : Array.from(document.querySelectorAll("#expenses-table tbody tr")).map(
        (row) => ({
          date: row.children[0].textContent,
          description: row.children[1].textContent,
          amount: parseFloat(row.children[2].textContent.replace("₱", "")),
          category: row.children[3].textContent,
          name: row.children[4].textContent,
        })
      );

  rows.forEach(({ amount, category, name }) => {
    grandTotal += amount;

    nameSummary[name] = (nameSummary[name] || 0) + amount;
    categorySummary[category] = (categorySummary[category] || 0) + amount;
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

  // 🔄 Await the Firestore budget
  const budget = await getMonthlyBudgetFromFirestore();

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
