/**
 * Secret Santa CLI Application
 * A command-line tool that reads employee data from a CSV file,
 * validates the data, and generates Secret Santa assignments.
 * Optionally accepts previous year assignments to avoid repeat pairings.
 */

import chalk from 'chalk';
import figlet from 'figlet';
import { getUserInput } from './services/userInput.js';
import { readCSV, writeCSV } from './services/csvService.js';
import { validateData, generateAssignments } from './models/secretSanta.js';
import { EMPLOYEE_REQUIRED_FIELDS, LAST_YEAR_REQUIRED_FIELDS } from './utils/constants.js';

// Display the application banner
console.log(
    chalk.green(
        figlet.textSync('Secret Santa', {
            horizontalLayout: 'full',
        })
    )
);

/**
 * Main function to handle the Secret Santa assignment process.
 * Handles user input, data validation, assignment generation, and output.
 */
const main = async () => {
    try {
        // Read employee data from user-specified CSV file
        const employeeFile = await getUserInput("Enter the employee CSV file name:");
        const employees = await readCSV(employeeFile);

        // Validate employee data for required fields and email format
        const employeeValidation = validateData(employees, EMPLOYEE_REQUIRED_FIELDS);

        if (!employeeValidation.valid) {
            employeeValidation.errors.forEach(err => console.log(chalk.red(`  ✗ ${err}`)));
            process.exit(1);
        }

        // Read previous year assignments to avoid repeat pairings (optional)
        const prevFile = await getUserInput("\nEnter the previous year assignment CSV file name (or press Enter to skip):");
        let previousAssignments = [];

        if (prevFile && prevFile.trim() !== '') {
            previousAssignments = await readCSV(prevFile);

            // Validate previous year data for required fields and email format
            const prevValidation = validateData(previousAssignments, LAST_YEAR_REQUIRED_FIELDS);

            if (!prevValidation.valid) {
                prevValidation.errors.forEach(err => console.log(chalk.red(`  ✗ ${err}`)));
                process.exit(1);
            }
        }

        // Generate new Secret Santa assignments ensuring no self-assignment or repeats
        const assignments = generateAssignments(employees, previousAssignments);

        // Save generated assignments to a timestamped output CSV file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputFile = `secret_santa_assignments_${timestamp}.csv`;
        await writeCSV(outputFile, assignments);
        console.log(chalk.green(`Assignments saved to "${outputFile}"`));
    } catch (error) {
        console.error(chalk.red("Error: "), error.message);
        process.exit(1);
    }
};

// Start the application
main().catch(err => {
    console.error(chalk.red("An unexpected error occurred:"), err);
    process.exit(1);
});
