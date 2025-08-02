// js/storage.js
import { db } from "./firebaseInit.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const EXPENSES_COLLECTION = "expenses";
const BUDGETS_COLLECTION = "budgets";

//
// 🔹 EXPENSE FUNCTIONS
//

// Save a new expense
export async function saveExpense(expense) {
  try {
    await addDoc(collection(db, EXPENSES_COLLECTION), expense);
    console.log("Expense saved to Firestore");
  } catch (e) {
    console.error("Error saving expense:", e);
  }
}

// Get all expenses with Firestore IDs
export async function getAllExpenses() {
  const snapshot = await getDocs(collection(db, EXPENSES_COLLECTION));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// Update an existing expense by Firestore ID
export async function updateExpense(id, updatedExpense) {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, id);
    await updateDoc(expenseRef, updatedExpense);
    console.log("Expense updated in Firestore");
  } catch (e) {
    console.error("Error updating expense:", e);
  }
}

// Delete an expense by Firestore ID
export async function deleteExpense(id) {
  try {
    const expenseRef = doc(db, EXPENSES_COLLECTION, id);
    await deleteDoc(expenseRef);
    console.log("Expense deleted from Firestore");
  } catch (e) {
    console.error("Error deleting expense:", e);
  }
}

// Get expenses filtered by user name (Claire or Marbs)
export async function getExpensesByUser(userName) {
  try {
    const q = query(
      collection(db, EXPENSES_COLLECTION),
      where("name", "==", userName)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Error fetching user-specific expenses:", e);
    return [];
  }
}

//
// 🔹 BUDGET FUNCTIONS
//

// Save monthly budgets for multiple users (e.g., Claire, Marbs)
export async function saveMonthlyBudgetToFirestore(budgets) {
  const budgetPromises = Object.entries(budgets).map(([name, amount]) =>
    setDoc(doc(db, BUDGETS_COLLECTION, name), { name, amount })
  );
  try {
    await Promise.all(budgetPromises);
    console.log("Budgets saved to Firestore");
  } catch (e) {
    console.error("Error saving budgets:", e);
  }
}

// Get all budgets and return as an object { claire: 32750, marbs: 38250, total: 71000 }
export async function getMonthlyBudgetFromFirestore() {
  const snapshot = await getDocs(collection(db, "budgets"));
  const data = {};
  snapshot.forEach((doc) => {
    const budget = doc.data();
    const amount = parseFloat(budget.amount); // ✅ force number
    data[budget.name] = isNaN(amount) ? 0 : amount;
  });
  data.total = (data.claire || 0) + (data.marbs || 0); // ✅ safe fallback
  console.log("Final budget object:", data);
  return data;
}
