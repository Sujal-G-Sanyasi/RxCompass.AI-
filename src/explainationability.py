import pandas as pd
import plotly.express as px
import seaborn as sns
import shap

class ShapExplained:
    def __init__(self, df):
        self.df = df
    
    def barplot_Top10(self, cols, index1, target, index2=10)-> None:
        try:
            sns.barplot(data=self.df, x=self.df[cols[index1:index2]], y=target[cols])
        except:
            pass