let transactions = [
  { date: "2026-04-01", amount: 5000, category: "Salary", type: "income" },
  { date: "2026-04-02", amount: 2000, category: "Food", type: "expense" }
];

function renderTransactions() {
  const table = document.getElementById("transactionTable");
  table.innerHTML = "";
  transactions.forEach(t => {
    const row = `<tr>
      <td>${t.date}</td>
      <td>₹${t.amount}</td>
      <td>${t.category}</td>
      <td>${t.type}</td>
    </tr>`;
    table.innerHTML += row;
  });
  updateSummary();
}

function updateSummary() {
  let income = transactions.filter(t => t.type === "income")
                           .reduce((sum, t) => sum + t.amount, 0);
  let expenses = transactions.filter(t => t.type === "expense")
                             .reduce((sum, t) => sum + t.amount, 0);
  document.getElementById("income").textContent = "₹" + income;
  document.getElementById("expenses").textContent = "₹" + expenses;
  document.getElementById("balance").textContent = "₹" + (income - expenses);
}

// Role toggle
document.getElementById("roleSelect").addEventListener("change", e => {
  document.getElementById("addTransactionSection").style.display =
    e.target.value === "admin" ? "block" : "none";
});

// Add transaction
document.getElementById("transactionForm").addEventListener("submit", e => {
  e.preventDefault();
  const newTransaction = {
    date: document.getElementById("date").value,
    amount: parseFloat(document.getElementById("amount").value),
    category: document.getElementById("category").value,
    type: document.getElementById("type").value
  };
  transactions.push(newTransaction);
  renderTransactions();
});

// Initial render
renderTransactions();

// Line chart for balance trend
const ctxTrend = document.getElementById('trendChart').getContext('2d');
new Chart(ctxTrend, {
  type: 'line',
  data: {
    labels: transactions.map(t => t.date),
    datasets: [{
      label: 'Balance Trend',
      data: transactions.map((t, i) => {
        let income = transactions.slice(0, i+1).filter(x => x.type === "income").reduce((s,x)=>s+x.amount,0);
        let expense = transactions.slice(0, i+1).filter(x => x.type === "expense").reduce((s,x)=>s+x.amount,0);
        return income - expense;
      }),
      borderColor: 'blue',
      fill: false
    }]
  }
});

// Pie chart for spending breakdown
const ctxCategory = document.getElementById('categoryChart').getContext('2d');
function updateCategoryChart() {
  const categories = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });
  new Chart(ctxCategory, {
    type: 'pie',
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ['red','orange','green','purple','cyan']
      }]
    }
  });
}
updateCategoryChart();

function updateInsights() {
  // Highest spending category
  const categories = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + t.amount;
  });
  const highest = Object.entries(categories).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("highestCategory").textContent =
    highest ? `Highest spending: ${highest[0]} (₹${highest[1]})` : "No expenses yet";

  // Monthly comparison (simple example)
  const months = {};
  transactions.forEach(t => {
    const month = t.date.slice(0,7); // YYYY-MM
    months[month] = (months[month] || 0) + t.amount;
  });
  document.getElementById("monthlyComparison").textContent =
    "Monthly totals: " + JSON.stringify(months);
}
updateInsights();
