const fs = require("fs");
const path = require("path");

function deleteEntry(type, data) {
  try {
    // Path to the schema file
    const schemaPath = path.join(__dirname, '../../db/dbdata.json');
    const schemaRaw = fs.readFileSync(schemaPath);
    const schema = JSON.parse(schemaRaw);

    // Convert type to match case of schema keys
    const normalizedType = Object.keys(schema).find(key => key.toLowerCase() === type.toLowerCase());

    if (!normalizedType) {
      console.log(`Invalid entry type: ${type}`);
      return;
    }

    const fields = schema[normalizedType].fields;

    if (fields.length === 0) {
      console.log(`No fields defined for entry type: ${normalizedType}`);
      return;
    }

    const firstField = fields[0];
    const firstFieldValue = data[firstField];

    if (!firstFieldValue) {
      console.log(`No value provided for the first field: ${firstField}`);
      return;
    }

    // Path to the specific data file
    const filename = path.join(__dirname, '../../db', `${normalizedType.toLowerCase()}.json`);
    console.log("Filename:", filename); // Debugging: Print the filename

    if (!fs.existsSync(filename)) {
      console.log(`No file found for entry type: ${normalizedType}`);
      return;
    }

    const rawData = fs.readFileSync(filename);
    const jsonData = JSON.parse(rawData);

    if (!Array.isArray(jsonData)) {
      console.log(`Invalid JSON data in ${normalizedType} file.`);
      return;
    }

    // Find the entry to delete based on the first field
    const entryIndex = jsonData.findIndex(entry => entry[firstField] === firstFieldValue);

    if (entryIndex === -1) {
      console.log(`No matching entry found for deletion in ${normalizedType} file.`);
      return;
    }

    jsonData.splice(entryIndex, 1);
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    console.log(`Entry in ${normalizedType.toLowerCase()} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting ${type.toLowerCase()} entry:`, error);
  }
}

module.exports = { deleteEntry };
