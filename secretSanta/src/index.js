const CsvService = require('./services/csvservice');
const SecretSantaService = require('./services/secretSantaService');

async function main() {
    try {
        const employees = await CsvService.readCsv('input/employees.csv');
        const previousAssignments = await CsvService.readCsv('input/previous_assignments.csv');

        const assignments = SecretSantaService.assignSecretChildren(employees, previousAssignments);
        await CsvService.writeCsv('output/assignments.csv', assignments);

        console.log('Secret Santa assignments generated successfully!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();