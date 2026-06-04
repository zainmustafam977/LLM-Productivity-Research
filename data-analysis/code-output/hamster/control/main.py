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
    df.to_csv("cars.csv",index=False, sep=";")


def cleanupProducedVehiclesColumn(df):

    # Feature 2
    df = df.rename(columns={'2022': 'ProducedVehicles'})
    df = df[~df.ProducedVehicles.isna()]
    df.ProducedVehicles = df.ProducedVehicles.apply(lambda x: x.replace(",", ""))
    
    df.ProducedVehicles = df.ProducedVehicles.astype('int64')
    df = df.sort_values(by="ProducedVehicles", ascending=False)
    return df

def expandData(df):

    # Feature 3
    wwCars = df.ProducedVehicles.sum()

    df["Percentage"] = (df.ProducedVehicles / wwCars) * 100
    df["CumulativePercentage"] = df["Percentage"].cumsum()
    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)