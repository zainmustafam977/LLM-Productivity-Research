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

    # Feature 1: limit the output to the top 10 countries
    df = df.head(10)

    # Output the data to a CSV file
    df.to_csv('output.csv', index=False)

    #  The csv file should not have an index column and the values should be seperated by ;
    df = pd.read_csv('output.csv', sep=';')

    print(df)


def cleanupProducedVehiclesColumn(df):

    # Feature 2: Rename the column from 2022 to ProducedVehicles
    df = df.rename(columns={'2022': 'ProducedVehicles'})

    # Drop all NaN rows from the column
    df = df.dropna(subset=['ProducedVehicles'])

    # Remove all commas from the values in the column
    df['ProducedVehicles'] = df['ProducedVehicles'].str.replace(',', '')

    # You should be left with only numeric data in the column so that you can change the datatype of the colum to integers
    df['ProducedVehicles'] = df['ProducedVehicles'].astype(int)

    # sort the dataframe by the vehicles produced. The countries with the most vehicles produces should come as first
    df = df.sort_values(by=['ProducedVehicles'], ascending=False)

    return df

def expandData(df):

    # Feature 3: Calculate the total number of vehicles produced worldwide and store it in a variable
    total = df['ProducedVehicles'].sum()

    # Expand the dataframe with a column called Percentage, which calculates the vehicle production of this country relative to the total vehicle production in percent
    df['Percentage'] = df['ProducedVehicles'] / total * 100

    # Expand the dataframe with a column CumulativePercentage. This column will start at 0% and, for each country, cumulate the percentages of vehicle production from that country and all the countries of the previous rows
    df['CumulativePercentage'] = df['Percentage'].cumsum()
    
    # Feature 4: Add a column called Rank, which ranks the countries by the number of vehicles produced
    df['Rank'] = df['ProducedVehicles'].rank(ascending=False)

 ###### This is a bug in prediction of the code as it keeps returing the same comment along with the same code!!


    # Feature 5: Add a column called CumulativeRank, which ranks the countries by the cumulative number of vehicles produced
    #df['CumulativeRank'] = df['CumulativePercentage'].rank(ascending=False)

    # Feature 6: Add a column called CumulativeRank, which ranks the countries by the cumulative number of vehicles produced
    #df['CumulativeRank'] = df['CumulativePercentage'].rank(ascending=False)

   ##############################################################################################################


    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)