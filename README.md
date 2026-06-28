<p align="center">
  <img src="./banner.svg" alt="AutoPay Banner" width="100%" />
</p>

# AutoPay
### Elegant crypto payment workspace powered by Arc

## Overview
AutoPay is a decentralized payment workspace designed to make Web3 transactions as simple as sharing a URL. Built on the Arc Testnet, it allows anyone to generate a secure, shareable payment request in seconds. Whether you're a freelancer, a small business, or just splitting a bill with a friend, AutoPay removes the complexity of crypto transfers, allowing the payer to simply connect their wallet and settle the amount in USDC.

## The Problem
Current crypto payments are often high-friction. Users have to manually copy long, complex wallet addresses, double-check network compatibility, and manually input amounts. One small typo can lead to permanent loss of funds. This "copy-paste" workflow is intimidating for new users and tedious for veterans, preventing crypto from becoming a mainstream payment method.

## The Solution
AutoPay solves this by abstracting the complexity into a single, shareable link. By encoding the recipient's address and the exact amount into a URL, we eliminate manual entry errors. Leveraging the speed and low fees of the **Arc Testnet**, we provide a payment experience that feels like Venmo or PayPal but with the security and decentralization of the blockchain.

## Key Features
- **Payment Workspace Layout**: A full SaaS dashboard interface that answers "What would you like to create today?" with quick templates for Quick Payments, Invoices, Donations, Tuition, Gifts, and Product Sales.
- **Visual Themes Selector**: Choose between 5 bespoke design aesthetics for the checkout page: **Modern**, **Minimal**, **Corporate**, **Glass**, and **Gradient**.
- **Interactive Workflow Animator**: High-fidelity horizontal animated guide that explains the automated payment workflow from generation to settlement.
- **Floating Action Controller**: Circular action HUD pinned to the screen with fast utilities for scanning QR codes, monitoring ledger transactions, and editing workspaces.
- **Wallet Integration**: Seamless connection via Wagmi and popular wallet providers.
- **Accurate USDC Transfers**: Precision handling of ERC-20 transfers with correct decimal logic (6 decimals).

## How It Works
1. **Choose Preset**: Select a workspace template or enter custom details.
2. **Select Theme**: Customize the checkout page visual theme (e.g., Glassmorphism, Gradient).
3. **Generate & Share**: Create your link, export the QR, and share it.
4. **Settle**: Payer connects their wallet and pays in USDC, settling instantly on Arc.

## Tech Stack
- **Vite + React**: For a lightning-fast, modern frontend experience.
- **Arc Testnet**: The underlying high-performance blockchain network.
- **Wagmi & Viem**: For robust Ethereum-compatible wallet interactions.
- **Lucide React**: For clean, consistent iconography.
- **Tailwind CSS**: For a responsive and beautiful design system.

## Getting Started
To run AutoPay locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/autopay.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000`.

---
*Built by AutoPay Team.*
