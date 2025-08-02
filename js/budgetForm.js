export function setupBudgetForm() {
  const claireInput = document.getElementById("budget-claire");
  const marbsInput = document.getElementById("budget-marbs");
  const totalDisplay = document.getElementById("budget-total-display");

  // Set default values
  claireInput.value = 32750;
  marbsInput.value = 38250;

  totalDisplay.textContent = `₱${(
    parseFloat(claireInput.value) + parseFloat(marbsInput.value)
  ).toFixed(2)}`;

  // Auto-update overall budget display as user types
  [claireInput, marbsInput].forEach((input) => {
    input.addEventListener("input", () => {
      const claire = parseFloat(claireInput.value) || 0;
      const marbs = parseFloat(marbsInput.value) || 0;
      const total = claire + marbs;

      totalDisplay.textContent = `₱${total.toFixed(2)}`;

      // Save the new budget into localStorage
      localStorage.setItem(
        "monthlyBudget",
        JSON.stringify({ claire, marbs, total })
      );

      // Trigger summary update
      updateSummary();
    });
  });
}
