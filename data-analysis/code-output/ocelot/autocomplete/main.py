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

    # print hte first 10 rows of the dataframe
    print(df.head(10))

def storeDataInCSV(filename, df):
    df.to_csv(filename, index=False, header=True)

##################################################


def cleanupProducedVehiclesColumn(df):

    ### rename the column 2022 to Produced Vehicles

    df.rename(columns={'2022': 'ProducedVehicles'}, inplace=True)

    ## q: is df.rename mutating the df?
    ## a: yes, it is mutating the df

    df.dropna(inplace=True)

    df['ProducedVehicles'] = df['ProducedVehicles'].replace(',', '', regex=True)

    # How do I change the type of the column to int?
    df['ProducedVehicles'] = df['ProducedVehicles'].astype(int)

    ## sort the df by ProducedVehicles highest to lowest
    df = df.sort_values(by=['ProducedVehicles'], ascending=False)


    return df

def expandData(df):
    #Calculate the total number of vehicles produced worldwide and store it in a variable.
    df['Percentage'] = df['ProducedVehicles'] / df['ProducedVehicles'].sum() * 100


    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)
    storeDataInCSV('cars.csv', df)