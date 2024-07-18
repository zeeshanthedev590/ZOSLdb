import json
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the input JSON data
db_data_file = os.path.join(script_dir, '..', 'db', 'dbdata.json')

# Read the input JSON data
with open(db_data_file, 'r') as input_file:
    input_data = json.load(input_file)

# Loop through each group in the input data
for group_name, group_info in input_data.items():
    # Initialize an empty dictionary for the group
    group_data = []

    # Construct the output filename
    output_filename = os.path.join(script_dir, '..', 'db', f'{group_name.lower()}.json')
    
    # Only create the file if it doesn't already exist
    if not os.path.exists(output_filename):
        with open(output_filename, 'w') as output_file:
            json.dump(group_data, output_file, indent=2)
        
        print(f'{group_name} data saved to {output_filename}')
    else:
        print(f'{output_filename} already exists, skipping.')

