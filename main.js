#! usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
console.log("=".repeat(80));
console.log(chalk.bold.blueBright("\n\t Welcome to --codewithAreeba-- OOP-MY-BANK\t"));
console.log("=".repeat(80));
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobNumber;
    accNumber;
    constructor(fName, lName, age, gender, mob, acc) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobNumber = mob;
        this.accNumber = acc;
    }
}
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let newAccounts = this.account.filter((acc) => acc.accNumber !== accObj.accNumber);
        this.account = [...newAccounts, accObj];
    }
}
let hblBank = new Bank();
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("female");
    let lName = faker.person.lastName("male");
    let number = parseInt(faker.helpers.fromRegExp("3##########"));
    let customer = new Customer(fName, lName, 20 * i, "female", number, 1000 + i);
    hblBank.addCustomer(customer);
    hblBank.addAccountNumber({ accNumber: customer.accNumber, balance: 100 * i });
}
async function bankService(bank) {
    let service = await inquirer.prompt([
        { type: "list",
            name: "select",
            message: "Please select the service:",
            choices: ["View Balance", "Cash WithDraw", "Cash Deposit", "Exit"]
        }
    ]);
    if (service.select == "View Balance") {
        let response = await inquirer.prompt([
            {
                type: "input",
                name: "number",
                message: "Please Enter Your Account Number:"
            }
        ]);
        let account = hblBank.account.find((acc) => acc.accNumber == response.number);
        if (!account) {
            console.log(chalk.red.bold("Invalid Account Number"));
        }
        if (account) {
            let name = hblBank.customer.find((item) => item.accNumber == account?.accNumber);
            console.log(`Dear ${chalk.blueBright(name?.firstName)} ${chalk.blueBright(name?.lastName)} your account balance is ${chalk.blueBright("$", account.balance)}`);
        }
    }
    if (service.select == "Cash WithDraw") {
        let response = await inquirer.prompt([
            {
                type: "accountNum",
                name: "number",
                message: "Please Enter Your Account Number:",
            }
        ]);
        let account = hblBank.account.find((acc) => acc.accNumber == response.number);
        if (!account) {
            console.log(chalk.red.bold("Invalid Account Number"));
        }
        if (account) {
            let answer = await inquirer.prompt([
                {
                    type: "number",
                    name: "rupees",
                    message: "Please Enter Your Amount To WithDraw: $"
                }
            ]);
            if (answer.rupees > account.balance) {
                console.log(`${chalk.redBright("Sorry!Insufficient Balance.")}`);
            }
            else {
                let newBalance = account.balance - answer.rupees;
                bank.transaction({ accNumber: account.accNumber, balance: newBalance });
                console.log(`$${chalk.blueBright(answer.rupees)} withdraw sucessfully! Your New Balance is $${chalk.blueBright(newBalance)}`);
            }
            ;
        }
    }
    if (service.select == "Cash Deposit") {
        let response = await inquirer.prompt([
            {
                type: "input",
                name: "number",
                message: "Please Enter Your Account Number:",
            }
        ]);
        let account = hblBank.account.find((acc) => acc.accNumber == response.number);
        if (!account) {
            console.log(chalk.red.bold("Invalid Account Number"));
        }
        if (account) {
            let answer = await inquirer.prompt([
                {
                    type: "number",
                    name: "rupees",
                    message: "Please Enter Your Amount To Deposit:"
                }
            ]);
            let newBalance = account.balance + answer.rupees;
            console.log(`$${chalk.blueBright(answer.rupees)} deposited in your account! Your new balance is $${chalk.blueBright(newBalance)}`);
        }
    }
    if (service.select == "Exit") {
        console.log("Exiting");
    }
}
bankService(hblBank);
