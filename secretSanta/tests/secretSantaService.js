const SecretSantaService = require('../src/services/secretSantaService');
const Employee = require('../src/models/Employee');

describe('SecretSantaService', () => {
    test('assignSecretChildren should assign unique secret children', () => {
        const employees = [
            new Employee('Alice', 'alice@acme.com'),
            new Employee('Bob', 'bob@acme.com'),
            new Employee('Charlie', 'charlie@acme.com')
        ];

        const assignments = SecretSantaService.assignSecretChildren(employees);
        expect(assignments.length).toBe(employees.length);

        const assignedChildren = assignments.map(a => a.Secret_Child_EmailID);
        expect(new Set(assignedChildren).size).toBe(employees.length);
    });

    test('assignSecretChildren should avoid repetitive assignments', () => {
        const employees = [
            new Employee('Alice', 'alice@acme.com'),
            new Employee('Bob', 'bob@acme.com'),
            new Employee('Charlie', 'charlie@acme.com')
        ];

        const previousAssignments = [
            { Employee_EmailID: 'alice@acme.com', Secret_Child_EmailID: 'bob@acme.com' }
        ];

        const assignments = SecretSantaService.assignSecretChildren(employees, previousAssignments);
        const aliceAssignment = assignments.find(a => a.Employee_EmailID === 'alice@acme.com');
        expect(aliceAssignment.Secret_Child_EmailID).not.toBe('bob@acme.com');
    });
});