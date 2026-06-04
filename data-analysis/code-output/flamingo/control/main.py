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

pd.set_option('display.max_rows', 10)

def rename(df):
    df_new = df.rename(columns = {'2022':'ProducedVehicles'}, inplace = True)
    return df_new


def cleanupProducedVehiclesColumn(df_new):

    # Feature 2

    return df_new

def expandData(df_new):

    # Feature 3


    return df_new


if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df_new)  
    df = expandData(df_new)

    #Output data
    outputData(df_new)

df.new.to_csv('cars.csv')
