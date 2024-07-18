import os
import re
import json

def remove_comments(input_content):
    return re.sub(r"\/\/.*$", "", input_content, flags=re.MULTILINE)

def tokenize(input_content):
    lines = input_content.splitlines()
    groups = {}
    current_group = None
    for line in lines:
        trimmed_line = line.strip()
        if not trimmed_line:
            continue
        if trimmed_line.startswith("@"):
            current_group = re.sub(r"\(.*\)", "", trimmed_line).strip("@")
            groups[current_group] = {"fields": []}
        elif trimmed_line == "$end" + current_group:
            current_group = None
        elif trimmed_line.startswith("["):
            field_content = trimmed_line[1:-1].strip()
            if not field_content.startswith("//"):
                groups[current_group]["fields"].append(field_content)
    return groups

def create_json(groups_and_fields):
    db_data_file = os.path.join(os.path.dirname(__file__), '..', 'db', 'dbdata.json')
    with open(db_data_file, 'w') as json_file:
        json.dump(groups_and_fields, json_file, indent=2)

def read_input_file(file_path):
    if not os.path.exists(file_path):
        print(f"Error: The file '{file_path}' does not exist.")
        return None
    with open(file_path, "r") as file:
        return file.read()

def main():
    input_file = input("Enter the name of your models file: ")
    input_file_path = os.path.join(os.path.dirname(__file__), '..', 'models', input_file)
    
    input_content = read_input_file(input_file_path)
    if input_content is None:
        return
    
    parsed_data = tokenize(remove_comments(input_content))
    for group, data in parsed_data.items():
        parsed_data[group]["fields"] = [field.strip() for field in data["fields"]]
    print(parsed_data)
    create_json(parsed_data)

    print("dbdata.json file generated.")

if __name__ == "__main__":
    main()
