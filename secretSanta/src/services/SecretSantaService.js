const _ = require('lodash');
const Employee = require('../models/Employee');

class SecretSantaService {
    static assignSecretChildren(employees, previousAssignments = []) {
        const assignments = [];
        const shuffledEmployees = _.shuffle(employees);

        for (let i = 0; i < shuffledEmployees.length; i++) {
            const employee = shuffledEmployees[i];
            let secretChild = shuffledEmployees[(i + 1) % shuffledEmployees.length];

            
            while (secretChild.email === employee.email) {
                secretChild = shuffledEmployees[(i + 2) % shuffledEmployees.length];
            }

            
            const previousAssignment = previousAssignments.find(pa => pa.Employee_EmailID === employee.email && pa.Secret_Child_EmailID === secretChild.email);
            if (previousAssignment) {
                secretChild = shuffledEmployees[(i + 2) % shuffledEmployees.length];
            }

            assignments.push({
                Employee_Name: employee.name,
                Employee_EmailID: employee.email,
                Secret_Child_Name: secretChild.name,
                Secret_Child_EmailID: secretChild.email
            });
        }

        return assignments;
    }
}

module.exports = SecretSantaService;