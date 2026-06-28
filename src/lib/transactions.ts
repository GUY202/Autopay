export interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  to?: string;
  from?: string;
  txHash: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
}

export function logTransaction(tx: Omit<Transaction, 'id'>) {
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  const newTx: Transaction = {
    ...tx,
    id: Math.random().toString(36).substring(2, 9),
  };
  transactions.unshift(newTx);
  localStorage.setItem('transactions', JSON.stringify(transactions.slice(0, 50))); // Keep last 50
  return newTx;
}

export function updateTransactionStatus(txHash: string, status: 'success' | 'failed') {
  const transactions: Transaction[] = JSON.parse(localStorage.getItem('transactions') || '[]');
  const index = transactions.findIndex(t => t.txHash === txHash);
  if (index !== -1) {
    transactions[index].status = status;
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
}
