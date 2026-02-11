# Secret Santa

A command-line application that generates Secret Santa assignments from employee CSV data. It validates input data, supports previous year assignments to avoid repeat pairings, and outputs the results to a CSV file.

## Features

- **CSV Input/Output** — Reads employee data and previous year assignments from CSV files, writes results to CSV.
- **Data Validation** — Validates required columns, empty values, email format, and duplicate emails.
- **No Self-Assignment** — Ensures no employee is assigned to themselves.
- **No Repeat Pairings** — Prevents the same giver→receiver pairing from the previous year.
- **Fair Distribution** — Each employee gives exactly one gift and receives exactly one gift.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd secret-santa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## How to Run

```bash
npm start
```

Or directly:

```bash
node src/index.js
```

The application will prompt you for:

1. **Employee CSV file name** — Path to the CSV file containing employee data.
2. **Previous year assignment CSV file name** *(optional)* — Path to the CSV file with last year's assignments. Press Enter to skip.

## Input Data Format

### Employee CSV (`employees.csv`)

| Column            | Description              |
|-------------------|--------------------------|
| `Employee_Name`   | Name of the employee     |
| `Employee_EmailID`| Email address of the employee |

### Previous Year Assignment CSV (`last_year.csv`) *(optional)*

| Column                 | Description                        |
|------------------------|------------------------------------|
| `Employee_Name`        | Name of the giver                  |
| `Employee_EmailID`     | Email of the giver                 |
| `Secret_Child_Name`    | Name of the assigned Secret Child  |
| `Secret_Child_EmailID` | Email of the assigned Secret Child |

## Output Data Format

The application generates a timestamped CSV file (e.g., `secret_santa_assignments_2026-02-12T02-55-00-000Z.csv`) with the following format:

| Column                 | Description                        |
|------------------------|------------------------------------|
| `Employee_Name`        | Name of the giver                  |
| `Employee_EmailID`     | Email of the giver                 |
| `Secret_Child_Name`    | Name of the assigned Secret Child  |
| `Secret_Child_EmailID` | Email of the assigned Secret Child |


## Project Structure

```
secret-santa/
├── src/
│   ├── index.js                  # Entry point - handles CLI flow
│   ├── models/
│   │   └── secretSanta.js        # Data validation and assignment logic
│   ├── services/
│   │   ├── csvService.js         # CSV read/write operations
│   │   └── userInput.js          # User input prompt service
│   └── utils/
│       └── constants.js          # Application constants
├── package.json
├── .gitignore
└── README.md
```

## Validation Rules

- Employee data must not be empty.
- Required columns must exist in the CSV header.
- All required fields must have non-empty values in every row.
- Email fields must have a valid email format.
- Duplicate emails are not allowed.
- At least 2 participants are required.


