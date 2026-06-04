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
    #print first 10 rows
    print(df.head(10))
    #store as csv with no index and ; as separator
    df.to_csv('cars.csv', sep=';', index=False)


def cleanupProducedVehiclesColumn(df):

    # Feature 2
    #rename column from 2022 to Produced Vehicles
    df = df.rename(columns={'2022': 'Produced Vehicles'})
    #drop Nan
    df = df.dropna()
    #remove commas
    df['Produced Vehicles'] = df['Produced Vehicles'].str.replace(',', '')
    #convert to int
    df['Produced Vehicles'] = df['Produced Vehicles'].astype(int)
    #sort by Produced Vehicles
    df = df.sort_values(by=['Produced Vehicles'], ascending=False)
    return df

def expandData(df):

    # Feature 3
    #calculate the totl number of produced vehicles
    total = df['Produced Vehicles'].sum()
    #calculate the percentage of each country
    df['Percentage'] = df['Produced Vehicles'].apply(lambda x: (x/total)*100)
    # calculate the cumulative percentage
    df['Cumulative Percentage'] = df['Percentage'].cumsum()

    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)