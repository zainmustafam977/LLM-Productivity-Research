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
    # show only the first 10 rows of the dataframe df
    

    # Feature 1
    print(df.head(10))
    # save the dataframe df to a csv file called cars.csv and do not include an index column and separate the values with a comma (,)
    # Hint: use the to_csv() function from pandas
    df.to_csv('cars.csv', index=False, sep=',')


def cleanupProducedVehiclesColumn(df):

    # Feature 2
    df.rename(columns={'2022': 'Produced Vehicles'}, inplace=True)
    
    # drop nan values from the column 'Produced Vehicles'
    df = df.dropna(subset=['Produced Vehicles'])
    # remove all commas from the column 'Produced Vehicles'
    df['Produced Vehicles'] = df['Produced Vehicles'].str.replace(',', '')
    # change the datatype of the column 'Produced Vehicles' to int
    df['Produced Vehicles'] = df['Produced Vehicles'].astype(int)
    # sort the dataframe df by the column 'Produced Vehicles' in descending order
    df = df.sort_values(by=['Produced Vehicles'], ascending=False)
    print(df.head(10))
    return df

def expandData(df):

    # Feature 3
    # Calculate the total number of vehicles produced worldwide and store it in a variable.
    # Hint: use the sum() function from pandas
    total = df['Produced Vehicles'].sum()
    # Expand the dataframe with a column called Percentage, which calculates the vehicle production of this country relative to the total vehicle production in percent.
    # Hint: use the apply() function from pandas
    df['Percentage'] = df['Produced Vehicles'].apply(lambda x: (x/total)*100)
    # Expand the dataframe with a column CumulativePercentage. This column will start at 0% and, for each country, cumulate the percentages of vehicle production from that country and all the countries of the previous rows.
    # Hint: use the cumsum() function from pandas
    df['CumulativePercentage'] = df['Percentage'].cumsum()
    print(df.head(10))
    return df

if __name__ == '__main__':

    #Fetching data    
    df = fetchCarData()
    
    #Tranforming data
    df = cleanupProducedVehiclesColumn(df)  
    df = expandData(df)

    #Output data
    outputData(df)