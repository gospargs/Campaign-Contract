const path = require('path');
const solc = require('solc');
const fs = require('fs-extra'); // File system module

const buildPath = path.resolve(__dirname,'build'); // reference to the build direcotry
fs.removeSync(buildPath); // removing entire buil directory

// Got the content of the campaign file
const campaignPath = path.resolve(__dirname,'contracts','Campaign.sol');
const source = fs.readFileSync(campaignPath,'utf8'); // readind the sourcecode from the file

// compiling everything we got
const output = solc.compile(source,1).contracts; // output contains two seperate objects (campaign contract and campaignFactory)

//recreating the build direcotry
fs.ensureDirSync(buildPath); // checks to see if the directory exists

// Loop over output object, take each contract from inside and write it to a different file inside the build directory

for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath,contract.replace(':','') + '.json'),
        output[contract]
    );
}