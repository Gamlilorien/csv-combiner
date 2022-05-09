# csv-combiner
### A Programming challenge for potential employer
See the original assignment here: [csv-combiner](https://github.com/Gamlilorien/csv-combiner).

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
|2014-11-27|electric|tesla|model s|100000|test.csv|
|2014-11-27|diesel|bmw|m3|90000test.csv|
|2014-12-13|hybrid|toyota|yaris|20000|test.csv|
|2014-11-27|gas|subaru|loyale|13000|test2.csv|
|2014-11-27|gas|ford|ranger|8000|test2.csv|
|2014-12-13|gas|mitsubishi|outlander|8000|test2.csv|

## Future Development
