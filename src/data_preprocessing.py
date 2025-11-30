import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

class DataCleaning:

    def __init__(self, df):
        self.df = df

    def info(self):
        return self.df.info()
    
    def isnull(self, sum):
        try:
            if not sum or sum == False:
                return self.df.isnull()

            if sum == True:
                return self.df.isnull().sum()

        except:
            print("Error on finding the null value")

    def duplicates(self):
        return self.df.isduplicated()
    
    def collinearity_reduction(self, threshold):
        try:
            columns = set()
            correlation = self.df.corr()
            for i in range(len(correlation.columns)):
                for j in range(i):
                    if abs(correlation.iloc[i, j]) > threshold:
                        colname = correlation.columns[i]
                        columns.add(colname)
                        
            return sorted(columns)
        except Exception as error:
            print(f"Error on finding the Collinearity : {error}")

class Splitter(DataCleaning):
    def __init__(self, df):
        super().__init__(df)

    def indepdent_dependet(self, col):
        X = self.df.drop(columns=col, axis=1)
        y = self.df[col]
        return X, y 
    
    def train_test_splitter(self, X_var, y_var, test_size):
        X_train, X_test, y_train, y_test = train_test_split(X_var, y_var, test_size=test_size, random_state=42)
        return X_train, X_test, y_train, y_test


class FeatureEng(Splitter):

    def __init__(self, X_train_col=None, X_test_col=None, y_train_col=None, y_test_col=None):
        self.X_train_col = X_train_col
        self.X_test_col = X_test_col
        self.y_train_col = y_train_col
        self.y_test_col = y_test_col
        self.y_label = None  # store fitted encoder for y

    def labelEncoder(self, X_train=False, X_test=False, y_train=False, y_test=False):
       
        label = LabelEncoder()

        if self.X_train_col is not None and X_train is not None:
            X_train1 = label.fit_transform(X_train[self.X_train_col])
            return X_train1

        if self.X_test_col is not None and X_test is not None:
            X_test1 = label.transform(X_test[self.X_test_col])
            return X_test1

      
        if self.y_train_col is not None and y_train is not None:
            # convert to 1D array no matter what
            y_train_arr = np.array(y_train).ravel()
            
            self.y_label = label.fit(y_train_arr) 
            y_train1 = self.y_label.transform(y_train_arr)
            return y_train1

        if self.y_test_col is not None and y_test is not None:
            if self.y_label is None:
                raise ValueError("y_train must be encoded before y_test.")
            y_test_arr = np.array(y_test).ravel()
            y_test1 = np.array([
                self.y_label.transform([s])[0] if s in self.y_label.classes_ else -1
                for s in y_test_arr
            ])
            return y_test1




        

        


