import h5py
import os

model_path = r"C:\Users\SHRUTI BORDE\Desktop\mm\Plant_Disease_Prediction\plant_disease_model.h5"

# Check if file exists
if not os.path.exists(model_path):
    print("File not found!")
else:
    try:
        # Try opening as HDF5
        with h5py.File(model_path, 'r') as f:
            print("HDF5 file detected. Keys inside:", list(f.keys()))
        print("You can now safely load the model using tf.keras.models.load_model()")
    except OSError as e:
        print("Not a valid HDF5 file. Maybe it's a SavedModel or corrupted?", e)
