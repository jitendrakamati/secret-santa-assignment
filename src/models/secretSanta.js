/**
 * Validates CSV data dynamically based on provided required fields.
 * Ensures required columns are present, values are non-empty, emails are valid, and no duplicates exist.
 * @param {Array<Object>} data - Array of objects from CSV.
 * @param {string[]} requiredFields - Array of required column names.
 * @returns {{ valid: boolean, errors: string[] }} - Validation result.
 */
export const validateData = (data, requiredFields = []) => {
    const errors = [];

    // Check if data is not empty
    if (!data || data.length === 0) {
        errors.push("Data is empty.");
        return { valid: false, errors };
    }

    // Check required fields exist in headers
    const headers = Object.keys(data[0]);

    for (const field of requiredFields) {
        if (!headers.includes(field)) {
            errors.push(`Missing required column: "${field}".`);
        }
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    // Validate each row
    const emailFields = requiredFields.filter(field => field.toLowerCase().includes('email'));
    const emailSets = {};
    emailFields.forEach(field => { emailSets[field] = new Set(); });

    data.forEach((row, index) => {
        const rowNum = index + 1;

        // Check for empty values in required fields
        for (const field of requiredFields) {
            if (!row[field] || row[field].trim() === '') {
                errors.push(`${field} is empty at row ${rowNum}.`);
            }
        }

        // Validate email format and check duplicates for email fields
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (const emailField of emailFields) {
            if (row[emailField] && row[emailField].trim() !== '') {
                // Check email format
                if (!emailRegex.test(row[emailField].trim())) {
                    errors.push(`Invalid email format "${row[emailField]}" at row ${rowNum}.`);
                }

                // Check for duplicate emails
                const email = row[emailField].trim().toLowerCase();
                if (emailSets[emailField].has(email)) {
                    errors.push(`Duplicate email "${row[emailField]}" in ${emailField} at row ${rowNum}.`);
                }
                emailSets[emailField].add(email);
            }
        }
    });

    // Need at least 2 participants
    if (data.length < 2) {
        errors.push("At least 2 participants are required for Secret Santa.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Generates Secret Santa assignments.
 * Ensures:
 *   - No one is assigned to themselves.
 *   - No one repeats the same assignment from the previous year.
 *   - Each person gives exactly one gift and receives exactly one gift.
 *
 * @param {Array<Object>} employees - Array of employee objects.
 * @param {Array<Object>} previousAssignments - Previous year's assignments (optional).
 *        Each object should have: { Employee_Name, Employee_EmailID, Secret_Child_Name, Secret_Child_EmailID }
 * @returns {Array<Object>} - Array of assignment objects.
 */
export const generateAssignments = (employees, previousAssignments = []) => {
    // Build a set of previous assignments for quick lookup
    const previousPairs = new Set();
    previousAssignments.forEach(assignment => {
        const key = `${assignment.Employee_EmailID?.trim().toLowerCase()}->${assignment.Secret_Child_EmailID?.trim().toLowerCase()}`;
        previousPairs.add(key);
    });

    const maxAttempts = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const receivers = [...employees];

        // Shuffle the receivers using Fisher-Yates algorithm
        for (let i = receivers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
        }

        // Check if this shuffle produces a valid assignment
        let isValid = true;

        for (let i = 0; i < employees.length; i++) {
            const giver = employees[i];
            const receiver = receivers[i];

            // No self-assignment
            if (giver.Employee_EmailID.trim().toLowerCase() === receiver.Employee_EmailID.trim().toLowerCase()) {
                isValid = false;
                break;
            }

            // No repeat from previous year
            const pairKey = `${giver.Employee_EmailID.trim().toLowerCase()}->${receiver.Employee_EmailID.trim().toLowerCase()}`;
            if (previousPairs.has(pairKey)) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            // Build the result
            return employees.map((giver, i) => ({
                Employee_Name: giver.Employee_Name,
                Employee_EmailID: giver.Employee_EmailID,
                Secret_Child_Name: receivers[i].Employee_Name,
                Secret_Child_EmailID: receivers[i].Employee_EmailID
            }));
        }
    }

    throw new Error("Could not generate valid Secret Santa assignments after maximum attempts. This may happen if too many constraints conflict.");
};
