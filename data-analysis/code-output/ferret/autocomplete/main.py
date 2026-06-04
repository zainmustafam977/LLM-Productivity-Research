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
    # I want to improve the output that is being generated. First limit the output to the console so that only the first 10 rows of the dataframe are printed out. Additionally, store the full data frame in a csv file called cars.csv. The csv file should not have an index column and the values should be seperated by ;.
    df.to_csv('cars.csv', sep=';', index=False)
    df = df.head(10)
    print(df)


def cleanupProducedVehiclesColumn(df):

    # Rename the column from 2022 to ProducedVehicles.Drop all NaN rows from the column.Remove all commas from the values in the column.
    df = df.rename(columns={'2022': 'ProducedVehicles'})
    df = df.dropna(subset=['ProducedVehicles'])
    df['ProducedVehicles'] = df['ProducedVehicles'].str.replace(',', '')
    df['ProducedVehicles'] = df['ProducedVehicles'].astype(int)
    # Sort the dataframe by the vehicles produced. The countries with the most vehicles produces should come as first.
    df = df.sort_values(by=['ProducedVehicles'], ascending=False)
    df = df.reset_index(drop=True)

    return df

def expandData(df):

    # The dataframe should be expanded with additional data that gets calculated in the expandData function.Calculate the total number of vehicles produced worldwide and store it in a variable.
    total = df['ProducedVehicles'].sum()
    # Expand the dataframe with a column called Percentage, which calculates the vehicle production of this country relative to the total vehicle production in percent.
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