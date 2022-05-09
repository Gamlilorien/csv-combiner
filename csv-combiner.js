const fs = require('fs');
var assert = require('chai').assert

//Run on file load:
//This function works using the following instead:
// node ./csv-combiner.js ./fixtures/accessories.csv ./fixtures/clothing.csv > combined.csv
// node ./csv-combiner.js ./fixtures/accessories.csv ./fixtures/household_cleaners.csv > combined.csv
// =========== INITIAL TESTS ===========
// assert(process.argv[2] !== undefined, 'file1 path is missing'); //Filenames can not be an empty string
// assert(process.argv[3] !== undefined, 'file2 path is missing');

// =========== GLOBAL VARIABLES ===========
let objectArray = [];
let data = "";
let csvCount = process.argv.length -2;
let csvProcessed = 0;
// let file1 = process.argv[2].replace('./fixtures/', '');
// let file2 = process.argv[3].replace('./fixtures/', '');
// ===========

// =========== Break Down of Concerns ===========
// 1. Sanitize the provided CSV text
// 2. Convert the text into an Array of JSON objects for each row or record
// 3. Iterate through our newly cleaned and organized data to construct and export into the desired format.

// ********** NOTES *************
// 1. Please note the NODE prefix and .js extension of the terminal command, eg 'node ./csv-combiner.js' rather than the 
// intended PHP file of './csv-combiner.php'. I ended up just using Node.js and some Vanilla JavaScript in leau of PHP.
//
// 2. Rather than assigning set values for the csv columns, this script will dynamically pass the header values
// and iterate through all data columns, provided that the two given CSV files match in column formatting.
//
// 3. NOTE: Data input should NOT contain commas within a single cell value. Due to manually stripping and reformatting the
// csv data, containing something like "Chauncy, D.D.S" as a single value can cause unexpected results.
//
// 4. While I did not have a 2 GB CSV file to test, I did run tests with CSV files up to 10 MB in size and the program 
// worked without a hitch (that's over 60k records)!
//
// 5. At the end of the exportCSV() function there is a line commented out reading: fs.writeFileSync('combined.csv', data);
// This can be used instead of the '> combined.csv' decliration of the terminal command if you don't want to be so verbose
// ===========

// *********** Functions ***********
//=========== sanitizeCSV() START ===========
function sanitizeCSV(filename, endFile) {
    //Test to verify that there we have a valid file path
    try {
        if (fs.existsSync(filename)) {
          //file exists
        }
    } catch(err) {
        console.error(err)
    }
    //End test
    
    fs.readFile('./fixtures/' +filename, "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        //remove special characters like \" and " besides spaces and commas (if any) 
        var output = data.replace(/[&\/\\#+()$~%'"*?<>{}]/g, '');
        output = data.split("\n");
        console.log(`Filename: ${filename}, endFile: ${endFile}, csvCount: ${csvCount}, csvProcessed: ${csvProcessed}`)
       convertToJSON(output, filename, endFile);
    })
};
// =========== sanitizeCSV() END ===========

// =========== convertToJSON() START ===========
function convertToJSON(string, filename, endFile) {
    let columnCount;
    //grab the headers and write as first line of data variable rather than setting as a static string
    if(data.length === 0) {
        let headerColumns = string[0].split(",");
        columnCount = headerColumns.length;
        let headerRow = "";
        for (let i = 0; i < columnCount; i++) {
            let column = headerColumns[i].replace(/[&\/\\#+()$~%'"*?<>{}]/g, '');
            column = column.replace("\r", ""); // for good measure otherwise it may not concatenate properly...
            headerRow = headerRow +column +",";
            if(i == columnCount -1) {
                //Then add the new filename column at the end
                data = headerRow + "filename\n";
            }
        }
    };
    //console.log(data);
    //Now process the non-header values
    for (let i = 1; i< string.length; i++) {
        //Take each record/row and break them up into the column values (eg like email_hash, and category)
        let record = string[i].split(",");
        let columnCount = record.length;
        let newObject = {};
        for (let i = 0; i < columnCount; i++) {
            let column = record[i].replace(/[&\/\\#+()$~%'"*?<>{}]/g, '');
            column = column.replace('\r', '');
            //Set to template object:
            newObject[i] = column;
            //Add our new filename column on last loop iteration
            if (i == columnCount -1) {
                newObject[columnCount] = filename;
                let nextArrayValue = objectArray.length;
                objectArray[nextArrayValue] = newObject;
            }
        }
    }
    //console.log(objectArray);
    csvProcessed = csvProcessed +1;
    console.log(`csvCount: ${csvCount}, csvProcessed: ${csvProcessed}`)
    //Only continue if we are processing the last of the CSV files
    if (csvProcessed == csvCount) {
        exportCSV(objectArray, endFile);
    }
    //exportCSV(objectArray, endFile);
};
// =========== convertToJSON() END ===========

// =========== exportCSV() START ===========
function exportCSV(array, endFile) {
    for (let i = 0; i < array.length; i++) {
        let row = array[i];
        let objLength = Object.keys(row).length; // row.length won't work for an {} object, use Object.keys().length instead
        let stringed = '';
        for (let i = 0; i < objLength; i++) {
            if(i == objLength -1) {
                stringed = stringed + row[i] +'\n';
            } else {
                stringed = stringed + row[i] +',';
            }
        }
        data = data + stringed;
    }
    //Now verifiy if all files have been processed before ouputing to file
    //We want the last object {} value of the last [] Array item.
    let arrayEndIndex = array.length -1;
    let lastValue = Object.keys(array[arrayEndIndex]).length -1;
    let lastEntry = array[arrayEndIndex];
    let lastFileName = lastEntry[lastValue];
    // if(lastFileName == endFile) {
    //     console.log(data);
    //     //fs.writeFileSync('combined.csv', data);
    // }
    // THIS should always evaluate since this function is only intended to run when processing the last file
    if(csvProcessed == csvCount) {
        console.log(data);
        //fs.writeFileSync('combined.csv', data);
    }
};
// =========== exportCSV() END ===========

// Parent function that triggers chain of nested functions on app load
//Expects two paramaters to be passed via the command line like the following:
//node csv-combiner.js ./fixtures/test.csv ./fixtures/test2.csv > combined.csv
//node csv-combiner.js ./fixtures/clothing2.csv ./fixtures/accessories2.csv > combined.csv
//node csv-combiner.js ./fixtures/clothing.csv ./fixtures/accessories.csv > combined.csv
//node csv-combiner.js ./fixtures/accessories.csv ./fixtures/household_cleaners.csv > combined.csv
//node csv-combiner.js ./fixtures/usSmiths.csv ./fixtures/usAddresses18k.csv > combined.csv
function runCommand() {
    //Validate that there are at least 4 or more command arguments as the first two (ie 0-1) will always be ignored and any thing after '>' will not be considered either.
    let arguments = process.argv;
    let argCount = arguments.length;
    assert.isAbove(argCount, 3, `ERROR: a minimum of 2 CSV inputs need to be provided. Inputs given: ${argCount -2}`);
    if(argCount > 3) {
        let endIndex = argCount -1;
        let endFile = arguments[endIndex].replace('./fixtures/', '');
        for(let i =2; i < argCount; i++) {
            let filename = arguments[i].replace('./fixtures/', '');
            //console.log(`Filename: ${filename}, endFile: ${endFile}, csvCount: ${csvCount}, csvProcessed: ${csvProcessed}`)
            sanitizeCSV(filename, endFile);
        }
    }
    // sanitizeCSV(file1);
    // sanitizeCSV(file2);
}
runCommand();