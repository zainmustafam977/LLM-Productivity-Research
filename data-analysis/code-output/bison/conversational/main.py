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
    # limit output to first 10 rows
    print(df.head(10))

    # store full dataframe to csv file
    df.to_csv('cars.csv', sep=';', index=False)    
    print(df)


def cleanupProducedVehiclesColumn(df):

    # Feature 2
    # Rename the column from 2022 to ProducedVehicles
    df.rename(columns={'2022': 'ProducedVehicles'}, inplace=True)

    # Drop all NaN rows from the column
    df.dropna(subset=['ProducedVehicles'], inplace=True)

    # Remove all commas from the values in the column
    df['ProducedVehicles'] = df['ProducedVehicles'].str.replace(',', '')

    # Convert the datatype of the column to integers
    df['ProducedVehicles'] = df['ProducedVehicles'].astype(int)

    # Sort the dataframe by the vehicles produced
    df.sort_values(by='ProducedVehicles', ascending=False, inplace=True)


    return df

def expandData(df):

    # Feature 3
    # Calculate the total number of vehicles produced worldwide and store it in a variable
    total_production = df['ProducedVehicles'].sum()

    # Expand the dataframe with a column called Percentage
    df['Percentage'] = (df['ProducedVehicles'] / total_production) * 100

    # Expand the dataframe with a column CumulativePercentage
    df['CumulativePercentage'] = df['Percentage'].cumsum()


    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)