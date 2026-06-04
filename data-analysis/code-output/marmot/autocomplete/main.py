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
    #print(df)
    df1 = df.head(10)
    # store dataframe in csv without index column and values seperated by ;
    df1.to_csv('output.csv', sep=';', index=False)


def cleanupProducedVehiclesColumn(df):

    # Feature 2
    # rename df column '2022' to 'ProducedVehicles'
    df = df.rename(columns={'2022': 'ProducedVehicles'})
    # drop all NaN rows
    df = df.dropna()
    # Remove all commas from the values in the column
    df['ProducedVehicles'] = df['ProducedVehicles'].str.replace(',', '').astype(float)
    # Sort the dataframe by the vehicles produced
    df = df.sort_values(by=['ProducedVehicles'], ascending=False)


    return df

def expandData(df):

    # Feature 3
    # Calculate the total number of vehicles produced worldwide and store it in a variable
    total = df['ProducedVehicles'].sum()

    # Expand the dataframe with a column called Percentage, which calculates the vehicle production of this country relative to the total vehicle production in percent
    df['Percentage'] = df['ProducedVehicles'] / total * 100

    # Expand the dataframe with a column CumulativePercentage. This column will start at 0% and, for each country, cumulate the percentages of vehicle production from that country and all the countries of the previous rows.
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