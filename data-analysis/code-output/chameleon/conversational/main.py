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
    print(df.head(10))
    df.to_csv('cars.csv', index=False, sep=';')



def cleanupProducedVehiclesColumn(df):

    # Feature 2
    df = df.rename(columns={'2022': 'ProducedVehicles'})
    # remove the rows with NaN values
    df = df.dropna()

    # fill the NaN values with a default value (e.g. 0)
    df = df.fillna(0)

    df['ProducedVehicles'] = df['ProducedVehicles'].replace(',', '', regex=True)
    df['ProducedVehicles'] = df['ProducedVehicles'].replace(',', '', regex=True).astype(int)
    df = df.sort_values(by='ProducedVehicles', ascending=False)

    return df

def expandData(df):

    # Feature 3
    total_vehicles_produced = df['ProducedVehicles'].sum()


    # assuming your dataframe is called 'df'
    total_vehicles_produced = df['ProducedVehicles'].sum()

    # define a function to calculate the percentage of vehicle production
    def calculate_percentage(row):
        return (row['ProducedVehicles'] / total_vehicles_produced) * 100

    # apply the function to each row of the dataframe and store the result in a new column called 'Percentage'
    df['Percentage'] = df.apply(calculate_percentage, axis=1)


    # assuming your dataframe is called 'df'
    total_vehicles_produced = df['ProducedVehicles'].sum()

    # define a function to calculate the percentage of vehicle production
    def calculate_percentage(row):
        return (row['ProducedVehicles'] / total_vehicles_produced) * 100

    # apply the function to each row of the dataframe and store the result in a new column called 'Percentage'
    df['Percentage'] = df.apply(calculate_percentage, axis=1)

    # calculate the cumulative sum of the 'Percentage' column and store the result in a new column called 'CumulativePercentage'
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