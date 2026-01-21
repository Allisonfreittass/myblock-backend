# MyBlock - Backend

This repository houses the server-side logic and smart contracts for **MyBlock**. It serves as a bridge between the traditional database (MongoDB) and the Ethereum blockchain, ensuring secure and automated rental management.

## 🏗️ Architecture & Tech Stack

The backend is built as a hybrid Web2/Web3 environment:

* **Runtime Environment:** [Node.js](https://nodejs.org/)
* **Web Framework:** [Express.js](https://expressjs.com/)
* **Database:** MongoDB (via Mongoose)
* **Blockchain Development:** [Hardhat](https://hardhat.org/)
* **Smart Contracts:** Solidity & OpenZeppelin
* **Authentication:** JWT & Bcryptjs
* **Task Scheduling:** Node-cron

## 📜 Smart Contract: Rent.sol

The core logic resides in the `Rent.sol` contract, which handles the lifecycle of a rental agreement:

* **Creation:** Generates a contract with a landlord, tenant, rent value, and due date.
* **Payments:** Accepts payments and automatically updates the next due date (+30 days).
* **Penalties:** Automatically applies a **10% fine** if the payment is made after the due date.
* **Status Management:** Tracks states such as `Active`, `Late` (Atrasado), `Finalized`, and `Cancelled`.
* **Security:** Uses `ReentrancyGuard` and `Ownable` for secure transactions.

## 🔌 API Endpoints

The Express server exposes routes for:
* **Auth:** User registration and login (`/auth`).
* **Properties:** CRUD operations for property listings (`/api/properties`).
* **Contracts:** Management of off-chain contract data (`/api/contracts`).
* **Rent Requests:** Handling tenant applications (`/api/requests`).

## ⚙️ Setup & Deployment

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/myblock-backend.git](https://github.com/yourusername/myblock-backend.git)
    cd myblock-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file with the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    PORT=3000
    # Add other blockchain-related keys here
    ```

4.  **Run Local Blockchain (Hardhat):**
    ```bash
    npx hardhat node
    ```

5.  **Deploy Smart Contracts:**
    ```bash
    npx hardhat ignition deploy ./ignition/modules/Lock.js --network localhost
    # Or run specific deployment scripts
    ```

6.  **Start the Server:**
    ```bash
    npm start
    ```

## ⏰ Automated Tasks

The system runs a daily cron job (`0 0 * * *`) to check for expired contracts and update their status accordingly.

## 📄 License

This project is licensed under the ISC License.
