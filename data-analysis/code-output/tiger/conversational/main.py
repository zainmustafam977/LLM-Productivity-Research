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
    filtered_df = df.head(10)
    filtered_df.to_csv("cars.csv", index=False, sep=';', header=False)
    print(filtered_df)



def cleanupProducedVehiclesColumn(df):

    # Feature 2

    df.rename(columns={"2022": "ProducedVehicles"}, inplace=True)
    df.dropna(inplace=True)
    df['ProducedVehicles'] = df['ProducedVehicles'].str.replace(',', '').astype(int)
    df.sort_values(by=["ProducedVehicles"])




    return df

def expandData(df):

    # Feature 3

    df.aggregate()


    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)