import { addExpenseToTable } from "./expenseTable.js";
import { updateSummary } from "./summary.js";
import { setupBudgetForm } from "./budgetForm.js";
import { saveExpense, getAllExpenses } from "./storage.js";

// Filter function
export async function filterByMonthYear(selectedMonthYear) {
  const allExpenses = await getAllExpenses();

  const [year, month] = selectedMonthYear.split("-");

  const filtered = allExpenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return (
      expDate.getFullYear().toString() === year &&
      String(expDate.getMonth() + 1).padStart(2, "0") === month
    );
  });

  // Clear current table
  const tbody = document.querySelector("#expenses-table tbody");
  tbody.innerHTML = "";

  // Add filtered expenses to table
  filtered.forEach(addExpenseToTable);

  // Update summary and charts
  updateSummary(filtered);
}

const form = document.getElementById("add-expense-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const expense = {
    date: document.getElementById("date").value,
    description: document.getElementById("description").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    name: document.getElementById("name").value,
  };

  if (
    !expense.date ||
    !expense.description ||
    !expense.amount ||
    !expense.category ||
    !expense.name
  ) {
    alert("Please fill in all fields.");
    return;
  }

  // Save to Firestore
  await saveExpense(expense);

  // Re-filter based on currently selected month
  const currentFilter = document.getElementById("month-filter").value;
  await filterByMonthYear(currentFilter);

  form.reset();
});

window.addEventListener("DOMContentLoaded", async () => {
  setupBudgetForm();

  // Set default to current month
  const now = new Date();
  const currentMonthYear = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;

  const filterElement = document.getElementById("month-filter");
  filterElement.value = currentMonthYear;

  // Set up filter change listener
  filterElement.addEventListener("change", async (e) => {
    await filterByMonthYear(e.target.value);
  });

  // Initially load expenses for current month
  await filterByMonthYear(currentMonthYear);
});
