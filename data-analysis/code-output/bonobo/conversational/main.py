#Data Transformation Task
import pandas as pd
import requests
from bs4 import BeautifulSoup

def fetchCarData():
    url = 'https://en.wikipedia.org/wiki/List_of_countries_by_motor_vehicle_production'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    table = soup.find('table', {'class': 'wikitable'})
    df = pd.read_html(str(table))[0]
    df = df[['Country', '2022']]
    df = df.replace('\[.*\]', '', regex=True)
    df = df[df['Country'] != 'World']
    df = df.sample(frac=1).reset_index(drop=True)
    return df
    
def outputData(df):

    # Feature 1

    # Get the first 10 rows of the DataFrame
    df_first_10 = df.head(10)
    
    # Save the first 10 rows to CSV
    df.to_csv("cars.csv",sep=';', index=False) 
    print(df)


def cleanupProducedVehiclesColumn(df):

    # Feature 2
    df = df.rename(columns={'2022': 'ProducedVehicles'})
    df.dropna(subset=['ProducedVehicles'], inplace=True)
    df['ProducedVehicles'] = df['ProducedVehicles'].astype('int')
    df = df.sort_values('ProducedVehicles')
    print(df)
    return df

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