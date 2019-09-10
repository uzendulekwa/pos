# POS
Point Of Sales Console Application With Node.js
The point of sales has the following features:
- On start, the terminal loads product information from a CSV file assets/products.csv.
- The cashier interacts with the software in a console via stdin and stdout.
- Items are rung up by product identifier.
- Products are entered by manually typing the 12
decimal digit product identifier followed by a newline character to stdin upon successfully
reading a barcode.
- If a partial product identifier number is entered the terminal outputs a listing of
product IDs and descriptions where the initial digits of the product ID match what was entered. However, if the prefix entered matches only a single product ID, then that product is rung up.
- When a product is rung up the name and price is output.
- When all items are rung up, the cashier instructs the terminal to total the bill by typing 'total' and the
terminal outputs the subtotal, total tax and total amount due.
- After totaling, the cashier enters the amount customer paid.
- Tax for the state is 6.3%, tax for the county is 0.7% and does not apply to grocery items.
Tax for the city is 2.0% and applies to all items.
- After receiving the amount paid, the terminal outputs a receipt to stdout, including the
following.
    - on a separate line for each item rung up, the following values: product name,
product identifier, price, and tax category
    - subtotal
    - tax for each jurisdiction
    - total due
    - amount paid
    - change due


products.csv
# Dependencies
Nodejs https://nodejs.org/en/

# Setup
Run `npm i` 

# Build
To build the source run `npm run build` in the main folder.

# Run
Run `npm start` to start the program

# Test
Run `npm test` to test the program
