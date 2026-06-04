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
    df.head(10)
    df.to_csv('cars.csv', index=False, sep=';') 
    return

  # Feature 2
def cleanupProducedVehiclesColumn(df):
 
    df = df.rename(columns={"2022": "Produced Vehicles"})
    df.head(3)
    return df

    # Feature 3
def expandData(df):
    df['Produced Vehicles'] = df['Produced Vehicles'].astype(int)
    total = df['Produced Vehicles'].sum()
    df["Percentage"] = df['Produced Vehicles'].apply(lambda x: x/total)
    df["Culumative Percentage"] = df['Percentage'].cumsum()
    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)