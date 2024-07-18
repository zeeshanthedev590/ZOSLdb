const fs = require("fs");
const path = require("path");

function deleteEntry(type, data) {
  try {
    const schemaRaw = fs.readFileSync(
      path.join(__dirname, "../db/dbdata.json")
    );
    const schema = JSON.parse(schemaRaw);

    if (!schema[type]) {
      console.log(`Invalid entry type: ${type}`);
      return;
    }

    const fields = schema[type].fields;

    if (fields.length === 0) {
      console.log(`No fields defined for entry type: ${type}`);
      return;
    }

    const firstField = fields[0];
    const firstFieldValue = data[firstField];

    if (!firstFieldValue) {
      console.log(`No value provided for the first field: ${firstField}`);
      return;
    }

    const filename = path.join(__dirname, `../db/${type.toLowerCase()}.json`);
    
    if (!fs.existsSync(filename)) {
      console.log(`No file found for entry type: ${type}`);
      return;
    }

    const rawData = fs.readFileSync(filename);
    const jsonData = JSON.parse(rawData);

    if (!Array.isArray(jsonData)) {
      console.log(`Invalid JSON data in ${type} file.`);
      return;
    }

    // Find the entry to delete based on the first field
    const entryIndex = jsonData.findIndex(entry => entry[firstField] === firstFieldValue);

    if (entryIndex === -1) {
      console.log(`No matching entry found for deletion in ${type} file.`);
      return;
    }

    jsonData.splice(entryIndex, 1);
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    console.log(`Entry in ${type.toLowerCase()} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting ${type.toLowerCase()} entry:`, error);
  }
}

module.exports = { deleteEntry };
