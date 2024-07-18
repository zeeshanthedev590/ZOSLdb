const fs = require('fs');
const path = require('path');

function addEntry(type, data) {
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
    const entry = {};

    // Ensure data length matches schema fields length
    if (data.length !== fields.length) {
      console.log(`Data length (${data.length}) does not match fields length (${fields.length})`);
      return;
    }

    for (let i = 0; i < fields.length; i++) {
      entry[fields[i]] = data[i] || null;
    }

    // Path to the specific data file
    const filename = path.join(__dirname, '../../db', `${normalizedType.toLowerCase()}.json`);
    console.log("Filename:", filename); // Debugging: Print the filename

    let jsonData = [];
    if (fs.existsSync(filename)) {
      const rawData = fs.readFileSync(filename);
      jsonData = JSON.parse(rawData);
    }

    if (!Array.isArray(jsonData)) {
      console.log(`Invalid JSON data in ${normalizedType} file.`);
      return;
    }

    jsonData.push(entry);
    fs.writeFileSync(filename, JSON.stringify(jsonData, null, 2));
    console.log(`New ${normalizedType.toLowerCase()} entry added successfully.`);
  } catch (error) {
    console.error(`Error adding ${type.toLowerCase()} entry:`, error);
  }
}

module.exports = { addEntry };
