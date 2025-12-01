import pandas as pd 
import numpy as np
import logging as log
import random
import pickle 
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.svm import SVC
from data_preprocessing import FeatureEng, Splitter, DataCleaning
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score

def basic_file_environment() -> None:
    np.random.seed(42)
    random.seed(42)

    log.basicConfig(

        level = log.DEBUG,
        format='[%(asctime)s] [%(levelname)s] %(message)s',  
        datefmt='%Y-%m-%d %H:%M:%S', 
        handlers=[ 

            log.FileHandler('RxCompassAI.log'),
            log.StreamHandler()

        ]
    )
basic_file_environment()

df_og = pd.read_csv('RxCompass.AI-/data/Cleaned_dataset/Disease_Cleaned_train.csv')


def train_test_splits() -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    try:
        splitter = Splitter(df=df_og)
        X,y = splitter.indepdent_dependet(col='prognosis')
        X_train, X_test, y_train, y_test = splitter.train_test_splitter(X_var=X, y_var=y, test_size=0.33)

        return X_train, X_test, y_train, y_test
    
    except:
        log.error("Enter a valid dataframe/Feature/Dependent and Independent Feature")
    

train_test_data = train_test_splits()
log.debug(f"Splitting successfull!")



def collinearity_reduction(threshold = 0.85) -> tuple[pd.DataFrame, pd.DataFrame]:
    try:
        global X_train
        X_train, X_test, y_train, y_test = train_test_data
        
        col_reduction_X_train = DataCleaning(df=X_train)
        col_reduction_X_test = DataCleaning(df=X_test)
        
        col_to_remove= col_reduction_X_train.collinearity_reduction(threshold=threshold)
        log.debug(f"Collinear Features found to be removed: {col_to_remove}")
        
        if col_to_remove != None and col_reduction_X_test != None:
            X_train_reduced = X_train.drop(columns=col_to_remove, axis=1).reset_index(drop=True)
            X_test_reduced = X_test.drop(columns=col_to_remove, axis=1).reset_index(drop=True)

            for col in X_test_reduced.columns:
                if col == 'prognosis':
                    X_test_reduced = X_test_reduced.drop(columns=['prognosis'], axis=1).reset_index(drop=True)
                    X_train_reduced = X_train_reduced.drop(columns=['prognosis'], axis=1).reset_index(drop=True)
                    log.debug("Dropped 'prognosis' column from X_test and X_train")

                if col.startswith("Unnamed"):
                    X_train_reduced = X_train_reduced.drop(columns='Unnamed: 0', axis=1)
                    X_test_reduced = X_test_reduced.drop(columns='Unnamed: 0', axis=1)
                    log.debug("Dropped 'Unnamed: 0' column from X_test and X_train")
                
                else:
                    None

            return X_train_reduced, X_test_reduced
        
        else:
            return X_train, X_test
    
    except Exception as error:
        log.error(f"Error on removing Collinear Features: {error}")
    
    finally:
        X_train_reduced.to_csv('RxCompass.AI-/data/PreProcessed_dataset/X_train_final.csv', index=False)
        X_test_reduced.to_csv('RxCompass.AI-/data/PreProcessed_dataset/X_test_final.csv', index=False)
        log.debug("Saved PreProcessed (Train and test) Datasets to 'data/PreProcessed_dataset/' folder")
        
df = collinearity_reduction(threshold=0.85)
X_train1, X_test1 = df
log.debug(f"Collinear Features removed successfully from Length: {len(X_train.columns)} Features to Length : {len(X_train1.columns)} Features")

def encoded_y_train() -> tuple[np.ndarray, np.ndarray]:
    try:
        X_train, X_test, y_train, y_test = train_test_data

        # Check that y_train/y_test are 1D arrays
        y_train = np.array(y_train).reshape(-1)
        y_test = np.array(y_test).reshape(-1)

        global le
        le = LabelEncoder()
        y_train_enc = le.fit_transform(y_train)

      
        y_test_enc = np.array([
            le.transform([s])[0] if s in le.classes_ else -1
            for s in y_test
        ])

        return y_train_enc, y_test_enc
    except Exception as error:
        log.error(error)

    finally:
        y_dataframe_train = pd.DataFrame(y_train_enc, columns=['prognosis'])
        y_dataframe_test = pd.DataFrame(y_test_enc, columns=['prognosis'])

        pickle.dump(le, open('RxCompass.AI-/RxCompass_App/backend/models/label_encoder.pkl', 'wb'))
        log.debug(f"LabelEncoder() fitted and saved successfully")
        
        y_dataframe_train.to_csv('RxCompass.AI-/data/PreProcessed_dataset/y_train_final.csv', index=False)
        y_dataframe_test.to_csv('RxCompass.AI-/data/PreProcessed_dataset/y_test_final.csv', index=False)
        log.debug("Saved Encoded Output (Train and test) Datasets to 'data/PreProcessed_dataset/' folder")

encoded_Ys = encoded_y_train()
log.debug(f"Encoded Y-Feature using LabelEncoder()")

def best_models(model) -> list:
    try:
        X_train, X_test, y_train1, y_test = train_test_data
        y_train, y_test = encoded_Ys
        X_train_use, X_test_use = df

        models = []
        predictions = []
        for model_idx in range(0, len(list(model))):
            estimator = list(model.values())[model_idx]
            
            print(f'_________{estimator}______________\n')
            
            # Training loop:
            estimator.fit(X_train_use, y_train)

            ## Prediction:
            y_pred = estimator.predict(X_test_use)
            y_finalPred = le.inverse_transform(y_pred)
            
            predictions.append(y_finalPred)
            models.append(estimator)

            print(classification_report(y_test, y_pred))
            accuracy = accuracy_score(y_test, y_pred)
            
            model_picked = pickle.dump(models[0], open('RxCompass.AI-/RxCompass_App/backend/models/RandomForest.pkl', 'wb'))
            log.debug(f"Model trained and saved successfully")  

        return predictions            
            
    except Exception as error:
        log.error(error)

best_models(model={
    "Randomforest" : RandomForestClassifier(n_estimators=100, n_jobs=-1, random_state=42),
    "GradientBoostingClassifier":GradientBoostingClassifier(n_estimators=100, random_state=42),
    "XgboostClassifier":XGBClassifier(random_state=42, n_estimators=100),
    "SupportVectorMachine":SVC(kernel='rbf', gamma='scale', random_state=42)
})

