# Architectural Patterns PoC

This repository contains Proof of Concept (PoC) implementations for various architectural, database, and system design patterns. Each pattern is implemented with a clear separation between the problem it aims to solve and the proposed solution, along with dedicated documentation.

## 🛠 Tech Stack

- **Runtime Environment:** Node.js
- **Language:** TypeScript
- **Web Framework:** Express
- **Databases/Caching:** PostgreSQL (`pg`), Redis (`ioredis`)
- **HTTP Client:** Axios

## 📂 Project Structure

The source code is located in the `src/` directory. Each pattern is organized in its own numbered folder, structured as follows:

```
src/
└── <pattern-name>/
    ├── docs/
    │   ├── 01-concept.md          # Core concept of the pattern
    │   ├── 02-problem.md          # The problem statement
    │   ├── 03-solution.md         # The solution approach
    │   ├── 04-diagrams.md         # Architectural diagrams
    │   └── 05-run-instructions.md # How to run this specific pattern
    ├── problem/                   # Code illustrating the problem
    │   └── index.ts
    └── solution/                  # Code illustrating the solution
        └── index.ts
```

## 🧩 Implemented Patterns

The repository currently includes implementations for the following patterns:

### Distributed Systems & Microservices
* **01. Eventual Consistency** (`src/01-eventual-consistency`)
* **02. Inbox Pattern** (`src/02-inbox-pattern`)
* **03. Outbox Pattern** (`src/03-outbox-pattern`)
* **04. Saga Pattern** (`src/04-saga-pattern`)
* **05. 2-Phase Commit (2PC) Pattern** (`src/05-2pc-pattern`)
* **09. Database Per Service** (`src/09-db-per-service`)

### Data Warehousing & Schema Design
* **06. Star Schema** (`src/06-star-schema`)
* **07. Galaxy Schema** (`src/07-galaxy-schema`)
* **08. Snowflake Schema** (`src/08-snowflake-schema`)
* **13. Physical Schema** (`src/13-physical-schema`)

### SQL & Database Performance
* **10. SQL Unions** (`src/10-sql-unions`)
* **11. SQL `OR` Performance** (`src/11-sql-or-performance`)
* **12. SQL Wrapping** (`src/12-sql-wrapping`)

### Concurrency, Locks & Leases
* **14. Claims** (`src/14-claims`)
* **15. Fence Tokens** (`src/15-fence-tokens`)
* **16. Aggregates & Locks** (`src/16-aggregates-locks`)
* **17. Leases** (`src/17-leases`)
* **18. Lease Ownership** (`src/18-lease-ownership`)
* **19. Lease Dirtiness** (`src/19-lease-dirtiness`)

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:ShubhamRGavhane/architectural_patterns.git
   cd patterns-poc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Code

You can use `ts-node` to run specific files. For example, to run the problem and solution for a specific pattern:

```bash
# Run a specific problem scenario
npx ts-node src/01-eventual-consistency/problem/index.ts

# Run the corresponding solution
npx ts-node src/01-eventual-consistency/solution/index.ts
```

For detailed, pattern-specific execution steps, please refer to the `docs/05-run-instructions.md` file within each pattern's directory.

## 🏗 Building for Production

To compile the TypeScript code to JavaScript, run:

```bash
npm run build
```

This will run the TypeScript compiler (`tsc`) as defined in `package.json`.
