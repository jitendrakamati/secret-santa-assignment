import inquirer from 'inquirer';

/**
 * Service to handle user input.
 * Shows a message to the user and returns the input value.
 * @param {string} message - The message prompt to display to the user
 * @returns {Promise<string>} - The value entered by the user
 */
export const getUserInput = async (message) => {
    const { input } = await inquirer.prompt([
        {
            type: 'input',
            name: 'input',
            message: message,
        },
    ]);
    return input;
};
