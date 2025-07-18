# ai_service/generate_model.py
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import MultiLabelBinarizer, LabelEncoder
import os

# --- Configuration ---
DATASET_PATH = 'dataset.csv' # Make sure this matches your downloaded CSV file name
MODEL_OUTPUT_PATH = 'model.pkl'
DISEASE_COLUMN_NAME = 'Disease' # The name of your disease column

def generate_model_from_csv():
    """
    Loads data from a CSV, preprocesses it (one-hot encodes symptoms),
    trains a disease prediction model, and saves the model along with necessary mappings.
    """
    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}")
        print("Please download a disease prediction dataset (e.g., from Kaggle) and place it in the 'ai_service' directory.")
        return

    print(f"Loading dataset from {DATASET_PATH}...")
    df = pd.read_csv(DATASET_PATH)

    # --- Data Preprocessing ---
    if DISEASE_COLUMN_NAME not in df.columns:
        print(f"Error: '{DISEASE_COLUMN_NAME}' column not found in the dataset. Please check your CSV file header.")
        print(f"Ensure the disease column is named '{DISEASE_COLUMN_NAME}' or update the script's DISEASE_COLUMN_NAME variable.")
        return

    # Separate features (symptoms) and target (disease)
    # Assuming all columns EXCEPT the DISEASE_COLUMN_NAME are symptom columns
    symptom_columns = [col for col in df.columns if col != DISEASE_COLUMN_NAME]
    
    # Combine all symptom columns into a single list of symptoms per row
    # Fill NaN values with an empty string to avoid issues with .lower() and .strip()
    # Then flatten the list of lists and get unique symptoms
    all_symptoms_raw = df[symptom_columns].fillna('').values.tolist()
    
    # Process each symptom string: split by underscore, flatten, clean, and get unique
    unique_symptoms = set()
    for row_symptoms in all_symptoms_raw:
        for symptom_cell in row_symptoms:
            # Split by underscore if symptoms are like "symptom_1_symptom_2"
            # Or just process as a single symptom if it's "itching"
            individual_symptoms = [s.strip().lower() for s in symptom_cell.split('_') if s.strip()]
            unique_symptoms.update(individual_symptoms)

    # Sort the unique symptoms to ensure consistent order for MultiLabelBinarizer
    symptoms_list = sorted(list(unique_symptoms))
    
    if not symptoms_list:
        print("Error: No unique symptoms found in the dataset. Please check your symptom columns.")
        return

    # Convert the symptom data into a format MultiLabelBinarizer can use
    # For each row, create a list of symptoms present in that row
    processed_symptoms_per_row = []
    for index, row in df.iterrows():
        current_row_symptoms = []
        for col in symptom_columns:
            symptom_cell_value = str(row[col]).strip().lower()
            if symptom_cell_value: # Only process non-empty symptom cells
                # Split by underscore if multiple symptoms are in one cell
                individual_symptoms_in_cell = [s.strip() for s in symptom_cell_value.split('_') if s.strip()]
                current_row_symptoms.extend(individual_symptoms_in_cell)
        processed_symptoms_per_row.append(current_row_symptoms)

    # Use MultiLabelBinarizer to create the one-hot encoded feature matrix (X)
    mlb = MultiLabelBinarizer(classes=symptoms_list)
    X_encoded = mlb.fit_transform(processed_symptoms_per_row)
    X = pd.DataFrame(X_encoded, columns=mlb.classes_)


    # Encode target labels (diseases) to numerical values
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(df[DISEASE_COLUMN_NAME])
    diseases_map = {i: disease for i, disease in enumerate(label_encoder.classes_)}

    print(f"Dataset loaded and preprocessed.")
    print(f"Total unique symptoms identified: {len(symptoms_list)}")
    print(f"First 5 unique symptoms: {', '.join(symptoms_list[:5])}")
    print(f"Total diseases identified: {len(diseases_map)}")
    print(f"Diseases map: {diseases_map}")

    # --- Model Training ---
    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

    # Using a Decision Tree Classifier for simplicity and interpretability
    model = DecisionTreeClassifier(random_state=42)
    model.fit(X_train, y_train)

    # Evaluate model (optional, but good practice)
    accuracy = model.score(X_test, y_test)
    print(f"Model trained. Accuracy on test set: {accuracy:.2f}")

    # --- Save Model and Mappings ---
    joblib.dump({
        'model': model,
        'symptoms_list': symptoms_list, # This is the list of all possible symptoms the model knows
        'diseases_map': diseases_map,
        'label_encoder': label_encoder, # Save the encoder to inverse transform predictions
        'mlb': mlb # Save the MultiLabelBinarizer to ensure consistent encoding for new predictions
    }, MODEL_OUTPUT_PATH)

    print(f"AI model, symptom list, disease mappings, and binarizer saved to {MODEL_OUTPUT_PATH}")

if __name__ == "__main__":
    generate_model_from_csv()
