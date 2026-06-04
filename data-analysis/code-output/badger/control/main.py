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
    print(df)

    print(df.head(10))
    df.to_csv('cars.csv', index=False, sep=';', encoding='utf-8')
    # Additionally, store the full data frame in a csv file called cars.csv. The csv file should not have an index column and the values should be seperated by ;
    


def cleanupProducedVehiclesColumn(df):

    # Feature 2
    df.rename(columns = {'2022':'ProducedVehicles'}, inplace = True)
    df = df[pd.notnull(df['ProducedVehicles'])]
    df = df.replace(',','', regex=True)

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