
//Validate that there are at least 4 or more command arguments as the first two (ie 0-1) will always be ignored and any thing after '>' will not be considered either.
let arguments = process.argv;
let argCount = arguments.length;
//console.log(arguments);
if(argCount > 3) {
    for(let i =2; i < argCount; i++) {
        sanitizeCSV(arguments[i].replace('./fixtures/', ''))
    }
} else {
    console.log(`ERROR: a minimum of 2 CSV inputs need to be provided. Inputs given: ${argCount -2}`)
}

