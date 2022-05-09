const fs = require('fs');
var assert = require('chai').assert

// =========== Break Down of Concerns ===========
// 1. Sanitize the provided CSV text
// 2. Convert the text into an Array of JSON objects for each row or record
// 3. After the final CSV file is processed, iterate through our newly cleaned and organized data to construct and export
// into the desired format.

// =========== GLOBAL VARIABLES ===========
let objectArray = [];
let data = "";
let csvCount = process.argv.length -2;
let csvProcessed = 0;
// ===========

// *********** Functions ***********
//=========== sanitizeCSV() START ===========
function sanitizeCSV(filename) {
    //Test to verify that there we have a valid file path
    try {
        if (fs.existsSync(filename)) {
          //file exists
        }
    } catch(err) {
        console.error(err)
    }
    //End test
    assert.include(filename, '.csv', 'The file provided does not have the expected .csv extension')
    
    fs.readFile('./fixtures/' +filename, "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }
        //remove special characters like \" and " besides spaces and commas (if any) 
        var output = data.replace(/[&\/\\#+()$~%'"*?<>{}]/g, '');
        output = data.split("\n");
        //console.log(`Filename: ${filename}, csvCount: ${csvCount}, csvProcessed: ${csvProcessed}`)
       convertToJSON(output, filename);
    })
};
// =========== sanitizeCSV() END ===========

// =========== convertToJSON() START ===========
function convertToJSON(string, filename) {
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
    //console.log(`csvCount: ${csvCount}, csvProcessed: ${csvProcessed}`)
    //Only continue if we are processing the last of the CSV files
    if (csvProcessed == csvCount) {
        exportCSV(objectArray);
    }
};
// =========== convertToJSON() END ===========

// =========== exportCSV() START ===========
function exportCSV(array) {
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
    // Now verifiy if all files have been processed before ouputing to file
    // THIS should always evaluate since this function is only intended to run when processing the last file
    if(csvProcessed == csvCount) {
        console.log(data);
    }
};
// =========== exportCSV() END ===========

// Parent function that triggers chain of nested functions on app load
function runCommand() {
    //Validate that there are at least 4 or more command arguments as the first two (ie 0-1) will always be ignored and any thing after '>' will not be considered either.
    let arguments = process.argv;
    let argCount = arguments.length;
    assert.isAbove(argCount, 3, `ERROR: a minimum of 2 CSV inputs need to be provided from the user. 2 system inputs +${argCount -2} from user`);
    if(argCount > 3) {
        for(let i =2; i < argCount; i++) {
            let filename = arguments[i].replace('./fixtures/', '');
            sanitizeCSV(filename);
        }
    }
};
runCommand();