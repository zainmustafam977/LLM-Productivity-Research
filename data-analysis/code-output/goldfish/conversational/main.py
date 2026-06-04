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
    df_cleaned = df.head(10)
    print(df_cleaned)
    df_cleaned.to_csv("cars.csv",sep=";")


def cleanupProducedVehiclesColumn(df):

    # Feature 2
    df.rename(columns={'2022': 'ProducedVehicles'}, inplace=True)
    df.dropna(inplace=True)
    df['ProducedVehicles'] = pd.to_numeric(df['ProducedVehicles'], errors='coerce').astype('Int64')
    sorted_df = df.sort_values(by='ProducedVehicles',ascending=False)


    return sorted_df

def expandData(df):

    # Feature 3
    column_sum = df['ProducedVehicles'].sum()
    #print(column_sum)
    df['Percentage'] = df['ProducedVehicles']/column_sum



    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)