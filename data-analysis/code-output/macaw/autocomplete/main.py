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
    #Limit the output to the console so that only the first 10 rows of the dataframe are printed out.
    print(df.head(10))

    #store the full data frame in a csv file called cars.csv. The csv file should not have an index column and the values should be seperated by ;
    df.to_csv('cars.csv', index=False, sep=';')

def cleanupProducedVehiclesColumn(df):

    # Feature 2
    #Rename the column from 2022 to ProducedVehicles
    df = df.rename(columns={'2022': 'ProducedVehicles'})

    #Drop all NaN rows from the column
    df = df.dropna(subset=['ProducedVehicles'])

    #Remove all commas from the values in the column
    df['ProducedVehicles'] = df['ProducedVehicles'].str.replace(',', '')
    
    #change the datatype of the colum to integers.
    df['ProducedVehicles'] = df['ProducedVehicles'].astype(int)
    
    #sort  ProducedVehicles by the vehicles produced in decreasing order
    df = df.sort_values(by=['ProducedVehicles'], ascending=False)
    
    return df

def expandData(df):

    # Feature 3

#Calculate the total number of vehicles produced worldwide and store it in a variable.
    total = df['ProducedVehicles'].sum()

#Expand the dataframe with a column called Percentage, which calculates the vehicle production of this country relative to the total vehicle production in percent.
    df['Percentage'] = df['ProducedVehicles'] / total * 100
    
    #CumulativePercentage column, which calculates the cumulative percentage of the vehicle production starting from 0%
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