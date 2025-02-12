const csv = require('csv-parser');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const Employee = require('../models/Employee');

class CsvService {
    static readCsv(filePath) {
        return new Promise((resolve, reject) => {
            const employees = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => employees.push(new Employee(row.Employee_Name, row.Employee_EmailID)))
                .on('end', () => resolve(employees))
                .on('error', (error) => reject(error));
        });
    }

    static writeCsv(filePath, data) {
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: [
                { id: 'Employee_Name', title: 'Employee_Name' },
                { id: 'Employee_EmailID', title: 'Employee_EmailID' },
                { id: 'Secret_Child_Name', title: 'Secret_Child_Name' },
                { id: 'Secret_Child_EmailID', title: 'Secret_Child_EmailID' }
            ]
        });

        return csvWriter.writeRecords(data);
    }
}

module.exports = CsvService;