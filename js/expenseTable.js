import { deleteExpense } from "./storage.js";
import { filterByMonthYear } from "./main.js";

export function addExpenseToTable(expense) {
  const tbody = document.querySelector("#expenses-table tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${expense.date}</td>
    <td>${expense.description}</td>
    <td>₱${parseFloat(expense.amount).toFixed(2)}</td>
    <td>${expense.category}</td>
    <td>${expense.name}</td>
  `;

  const actionTd = document.createElement("td");
  const deleteBtn = createDeleteButton(expense.id);
  actionTd.appendChild(deleteBtn);
  tr.appendChild(actionTd);

  tbody.appendChild(tr);
}

function createDeleteButton(expenseId) {
  const btn = document.createElement("button");
  btn.textContent = "Delete";
  btn.classList.add("delete-btn");

  btn.addEventListener("click", async () => {
    console.log("Trying to delete:", expenseId); // ✅ debug log

    if (confirm("Are you sure you want to delete this expense?")) {
      await deleteExpense(expenseId);
      console.log("Deleted. Refreshing...");
      const currentFilter = document.getElementById("month-filter").value;
      await filterByMonthYear(currentFilter);
    }
  });

  return btn;
}
