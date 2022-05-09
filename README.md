# csv-combiner
### A Programming challenge for potential employer
See the original assignment here: [csv-combiner](https://github.com/AgencyPMG/ProgrammingChallenges/tree/master/csv-combiner).

## Objective:
1. Write a terminal/ command line application that accepts two or more CSV files as arguments and merges them together. We will assume that the source CSVs will have matching columns (see examples within the provided `fixtures` folder). The application should iterate through any number of columns and then the `stdout` of your script (ie the `> someFilename.csv` portion of your command) should export a new CSV file with the inputed columns plus one additional new column simply named `filename` that displays the filename of the original source CSV the particular rows hailed from.

2. The program should allow for more than two CSV files as inputs.
3. It should allow for processing potentially gigantic file sizes of 2GB or more!
4. Use best coding practices and build it to be scalable.
5. Implement testing and unit tests for good measure. 

## Tools Used:
* [Node.js](https://nodejs.dev/)
* The Node.js [FS (File System) Module](https://nodejs.dev/learn/the-nodejs-fs-module) for selecting and passing our CSV inputs.
* [Chai](https://www.chaijs.com/) & [Mocha](https://mochajs.org/) (for Unit and Automated Testing)
* Some good ol'fashoned JavaScript!

## Example
If we use two source CSVs named test.csv and test2.csv with the following data:

test.csv
|date|type|brand|model|price|
|----|----|-----|-----|-----|
|2014-11-27|electric|tesla|model s|100000|
|2014-11-27|diesel|bmw|m3|90000|
|2014-12-13|hybrid|toyota|yaris|20000|

test2.csv
|date|type|brand|model|price|
|----|----|-----|-----|-----|
|2014-11-27|gas|subaru|loyale|13000|
|2014-11-27|gas|ford|ranger|8000|
|2014-12-13|gas|mitsubishi|outlander|8000|

**Then this command**
```
node csv-combiner.js ./fixtures/test.csv ./fixtures/test2.csv > output.csv
```

**You Should Recieve This As The Final Output:**
output.csv
|date|type|brand|model|price|filename|
|----|----|-----|-----|-----|--------|
|2014-11-27|electric|tesla|model s|100000|test.csv|
|2014-11-27|diesel|bmw|m3|90000|test.csv|
|2014-12-13|hybrid|toyota|yaris|20000|test.csv|
|2014-11-27|gas|subaru|loyale|13000|test2.csv|
|2014-11-27|gas|ford|ranger|8000|test2.csv|
|2014-12-13|gas|mitsubishi|outlander|8000|test2.csv|

## NOTES
- Please note the NODE prefix and .js extension of the terminal command, eg 'node ./csv-combiner.js' rather than the intended PHP file of './csv-combiner.php'. I ended up just using Node.js and some Vanilla JavaScript in leau of PHP.

- The given CSV files need to match in column formatting. For example, if one CSV has `date, model, make & price` as the columns, all other CSVs intended to be merged should also be structured with such columns and types of data.

- NOTE: Data input should NOT contain commas within a single cell value. For example, a table field containing something like `Chauncy, D.D.S` as a single value can cause unexpected results due to how the csv data is being broken apart and reformatted.

- While I did not have a 2 GB CSV file to test, I did run tests with CSV files in excess of 10 MB in size and the program worked without a hitch (that's over 60k records)!

- Currently all input CSV files need to reside within the `fixtures` directory. Due to this you can omit the `./fixtures/` file path prefix.

## Future Development
See [Short Answers](https://github.com/Gamlilorien/csv-combiner/blob/main/shortAnswers.md) for some ideas.

## Installation & Use
Down load the repo and then `cd` to the new directory in your terminal and type `npm install`.

#### Base command structure:
**node csv-combiner.js csv1 csv2 optionalCsv1 optionalCsv2 > outputFileName.csv**

- A minimum of 2 CSV files are required
- Anything after the `>` will be the name of the new output file of your choice

#### Sample Test Commands:
`node csv-combiner.js ./fixtures/accessories.csv ./fixtures/clothing.csv > combined.csv`
`node csv-combiner.js ./fixtures/accessories.csv ./fixtures/household_cleaners.csv > combined.csv`
`node csv-combiner.js ./fixtures/test.csv ./fixtures/test2.csv > combined.csv`

##### You can also omit the `./fixtures/` path prefix due to the command requring all CSVs to exist in said direcotry anyway
`node csv-combiner.js test.csv test2.csv test3.csv > combined.csv`
`node csv-combiner.js clothing2.csv accessories2.csv clothing.csv accessories.csv, household_cleaners > combined.csv`
`node csv-combiner.js usSmiths.csv usAddresses18k.csv usAddresses18k_2.csv usAddresses18k_3.csv > combined.csv`

##### If you wish to see the output in the console (rather than outputting to a new file) then simply omit the final `> combined.csv` argument.
`node csv-combiner.js test.csv test2.csv test3.csv`