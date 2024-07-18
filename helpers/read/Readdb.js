const fs = require("fs");
const path = require("path");

function readEntries(type) {
  try {
    const filename = path.join(__dirname, `../db/${type.toLowerCase()}.json`);
    const rawData = fs.readFileSync(filename);
    const jsonData = JSON.parse(rawData);

    if (!Array.isArray(jsonData)) {
      console.log(`Invalid JSON data in ${type} file.`);
      return null;
    }

    console.log(`Entries for ${type.toLowerCase()} read successfully.`);
    return jsonData;
  } catch (error) {
    console.error(`Error reading ${type.toLowerCase()} entries:`, error);
    return null;
  }
}

// const data = readEntries('your_type');

module.exports = { readEntries };
