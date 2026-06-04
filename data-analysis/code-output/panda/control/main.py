#Data Transformation Task
import pandas as pd
import requests
from bs4 import BeautifulSoup

def fetchCarData():
    url = 'http://localhost:5000/public/cache/Wikipedia-Car-Table.html'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    table = soup.find('table', {'class': 'wikitable'})
    df = pd.read_html(str(table))[0]
    df = df[['Country', '2022']]
    df = df.replace('\[.*\]', '', regex=True)
    df = df[df['Country'] != 'World']
    df = df.sort_values(by=['Country'])
    df = df.reset_index(drop=True)
    return df
    
def outputData(df):

    # Feature 1
    print(df.head(10))
    df.to_csv("cars.csv", sep=';')



def cleanupProducedVehiclesColumn(df):

    # Feature 2
    df_new = df_new.dropna()
    df_new = df['2022'].astype('int')
    df_new = df.rename(columns={'2022': 'ProducedVehicles'})
    
    df_new = df_new.replace(',','', regex=True)
    # df_new = df_new['ProducedVehicles'].astype('int')
    df_new = df_new.sort_values(by=['ProducedVehicles'])
    return df_new


def expandData(df):

    # Feature 3


    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)