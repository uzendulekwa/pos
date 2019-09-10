const readline = require('readline');
const csv = require('csv-parser');
const fs = require('fs');
import {Product} from './model';
import {State} from "./state";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

export class PosController {
    constructor() { }
    start() {
        fs.createReadStream('./resources/products.csv')
            .pipe(csv())
            .on('data', (data: Product) => {
                State.products.push({...data, price: parseFloat(data.price.toString()), tax: this.getTax(data.price, data.category)});
            })
            .on('end', () => {
                console.log('POS is Ready!!');
                this.startTransaction();
            });
    }
    startTransaction() {
        this.resetPos();
        console.log('\n\n');
        console.log('=====================================');
        console.log('          New Transaction');
        console.log('=====================================');
        this.takeProductInput();
    }
    processInput(input: string) {
        if (input === 'total') {
            this.runTotal();
        } else {
            this.processProductId(input);
        }
    }
    processProductId(productId: string) {
        const results = this.search(productId);
        switch (results.length) {
            case 0:
                console.log('Not found: ', productId);
                break;
            case 1:
                this.runProduct(results[0]);
                break;
            default:
                for(let product of results) {
                    console.log(product.id, ': ', product.name);
                }
                break;
        }
        this.takeProductInput();
    }
    search(productId: string) {
        return State.products.filter(product => {
            return product.id.startsWith(productId)
        });
    }
    resetPos() {
        State.cart = [];
        State.subtotal = 0;
        State.totalTax = 0;
        State.totalStateTax = 0;
        State.totalCountyTax = 0;
        State.totalCityTax = 0;
        State.total = 0;
    }
    runProduct(product: Product) {
        State.cart.push(product);
        console.log(product.name, '\t\t', product.price);
    }
    runTotal() {
        if (State.cart.length === 0) {
            this.takeProductInput();
            return;
        }
        console.log('\n\n');
        console.log('----Running Total----');
        State.subtotal = State.cart.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
        State.totalTax = State.cart.reduce((accumulator, currentValue) => accumulator + currentValue.tax.total, 0);
        State.totalStateTax = State.cart.reduce((accumulator, currentValue) => accumulator + currentValue.tax.state, 0);
        State.totalCountyTax = State.cart.reduce((accumulator, currentValue) => accumulator + currentValue.tax.county, 0);
        State.totalCityTax = State.cart.reduce((accumulator, currentValue) => accumulator + currentValue.tax.city, 0);
        State.total = State.subtotal + State.totalTax;
        console.log('Subtotal:\t\t\t\t\t\t', State.subtotal);
        console.log('Tax:\t\t\t\t\t\t\t', State.totalTax);
        console.log('Total:\t\t\t\t\t\t\t', State.total);
        this.takeCustomerAmountPaidInput();
    }
    processCustomerAmountPaid(amount: number) {
        State.amountPaidByCustomer = amount;
        State.customerChange = amount - State.total;
        this.endTransaction();
    }
    endTransaction() {
        console.log('\n\n');
        console.log('----Receipt----');
        for (let product of State.cart) {
            console.log(product.id, ' ', product.name, ' (', product.category, ')\t\t\t', product.price);
        }
        console.log('\n');
        console.log('Subtotal:\t\t\t\t\t\t', State.subtotal);
        console.log('State Tax:\t\t\t\t\t\t', State.totalStateTax);
        console.log('County Tax:\t\t\t\t\t\t', State.totalCountyTax);
        console.log('City Tax:\t\t\t\t\t\t', State.totalCityTax);
        console.log('Total Tax:\t\t\t\t\t\t', State.totalTax);
        console.log('Total:\t\t\t\t\t\t\t', State.total);
        console.log('AmountPaid:\t\t\t\t\t\t', State.amountPaidByCustomer);
        console.log('Change Due:\t\t\t\t\t\t', State.customerChange);
        this.startTransaction();
    }
    getTax(price: number, category: string) {
        const stateTaxRate = .063;
        const countyTaxRate = .007;
        const cityTaxRate = .02;

        const stateTax = category === 'g' ? 0 : price * stateTaxRate;
        const countyTax = category === 'g' ? 0 : price * countyTaxRate;
        const cityTax = price * cityTaxRate;
        return {
            state: stateTax,
            county: countyTax,
            city: cityTax,
            total: stateTax + countyTax + cityTax
        };
    }
    takeProductInput() {
        rl.question('Product ID: ', (answer: string) => {
            this.processInput(answer);
        });
    }
    takeCustomerAmountPaidInput() {
        rl.question('Amount Paid: ', (answer: string) => {
            this.processCustomerAmountPaid(parseFloat(answer));
        });
    }
}
