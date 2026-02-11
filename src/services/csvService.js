import fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

/**
 * Reads a CSV file and returns its content as an array of objects.
 * @param {string} filePath - Absolute or relative path to the CSV file.
 * @returns {Promise<Array>} - Resolves with the parsed data.
 */
export const readCSV = (filePath) => {
    // Validate filePath is provided
    if (!filePath || filePath.trim() === '') {
        throw new Error("File path is required.");
    }

    // Validate file exists
    if (!fs.existsSync(filePath)) {
        throw new Error(`File "${filePath}" does not exist.`);
    }

    // Validate file extension is .csv
    if (!filePath.toLowerCase().endsWith('.csv')) {
        throw new Error(`File "${filePath}" is not a CSV file. Please provide a .csv file.`);
    }

    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

/**
 * Writes an array of objects to a CSV file.
 * Infers headers from the keys of the first object in the data array.
 * @param {string} filePath - Path where the CSV file will be written.
 * @param {Array<Object>} data - Array of objects to write.
 * @returns {Promise<void>}
 */
export const writeCSV = async (filePath, data) => {
    if (!data || data.length === 0) {
        throw new Error("No data provided to write to CSV.");
    }

    // Infer headers from the first object
    const headers = Object.keys(data[0]).map(key => ({
        id: key,
        title: key
    }));

    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: headers
    });

    await csvWriter.writeRecords(data);
};
