const fs = require("fs");
const csv = require("fast-csv");


async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on("data", (row) => data.push(row))
            .on("end", () => resolve(data))
            .on("error", (error) => reject(error));
    });
}


function assignSecretSanta(employees, previousAssignments) {
    let availableRecipients = [...employees]; 
    const assignments = [];

    employees.forEach((employee) => {
        let possibleRecipients = availableRecipients.filter((recipient) => 
            recipient.Employee_EmailID !== employee.Employee_EmailID && 
            !previousAssignments.some(prev => 
                prev.Employee_EmailID === employee.Employee_EmailID &&
                prev.Secret_Child_EmailID === recipient.Employee_EmailID 
            )
        );

        if (possibleRecipients.length === 0) {
            throw new Error("No valid assignments possible. Try reshuffling.");
        }

        const chosenIndex = Math.floor(Math.random() * possibleRecipients.length);
        const secretChild = possibleRecipients.splice(chosenIndex, 1)[0];

        assignments.push({
            Employee_Name: employee.Employee_Name,
            Employee_EmailID: employee.Employee_EmailID,
            Secret_Child_Name: secretChild.Employee_Name,
            Secret_Child_EmailID: secretChild.Employee_EmailID,
        });

        availableRecipients = availableRecipients.filter(emp => emp.Employee_EmailID !== secretChild.Employee_EmailID);
    });

    return assignments;
}

function writeCSV(filePath, data) {
    return new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(filePath);
        csv.write(data, { headers: true })
            .pipe(ws)
            .on("finish", resolve)
            .on("error", reject);
    });
}

async function main() {
    try {
        const employees = await readCSV("employees.csv");
        const previousAssignments = await readCSV("previous_assignments.csv");

        if (employees.length < 2) {
            throw new Error("At least two employees are required for Secret Santa.");
        }

        const assignments = assignSecretSanta(employees, previousAssignments);
        await writeCSV("secret_santa_output.csv", assignments);
        console.log("Secret Santa assignments generated successfully!");
    } catch (error) {
        console.error("Error:", error.message);
    }
}


main();
