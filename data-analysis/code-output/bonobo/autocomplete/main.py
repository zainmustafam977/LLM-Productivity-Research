import re
import sys
import requests
from bs4 import BeautifulSoup
from collections import Counter
from nltk.corpus import stopwords

def scrapeURL(url):
    response = requests.get(url)
    html_content = response.content.decode('utf-8') 
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()

    clean_text = re.sub(r'[^\w\s\.]', '', text)
    clean_text = clean_text.lower()
    clean_text = clean_text.replace('\n', '')
    clean_text = clean_text.replace('\t', '')
    clean_text = re.sub(' +', ' ', clean_text)

    return clean_text

def outputContent(content):

    print("\nLink to Article")
    print(url)
    print("\nContent Preview")
    print(content[:500] + "...")


# function that Convert an string into a list of words by splitting it at every whitespace character
def convertToList(content):
    words = content.split(' ')
    
    # calculate the number of words in a list and print it out to the console
    print(len(words))

    uniqueWords = set(words)
    print(len(uniqueWords))

    total = 0
    for word in words:
        total += len(word)
    print(total / len(words))
    return words


# Create a list of German stopwords by using the stopwords function from the package nltk
def getStopWords():
    stop_words = set(stopwords.words('german'))
    return stop_words

# Create a new list filteredWords which should contain all words but with the stopwords filtered out. You can achieve this by using the list of stopwords to remove all stopwords from the original list of words.
def filterStopWords(words, stop_words):
    filteredWords = []
    for word in words:
        if word not in stop_words:
            filteredWords.append(word)
    return filteredWords


# Function that calculates the number of ocurrences of an string in a list and returns a sorted list of tuples with the most used words and their number of ocurrences
def mostUsedWords(words):
    

def outputAnalysis(content):

    print("\nText Analysis")
    
    # Feature 1
    convertToList(content)

  
    print("\n Stop Words")

    # Feature 2
    
    filteredWords = filterStopWords(convertToList(content), getStopWords())

    print('===============')
    convertToList(content)
    print('===============')
    print(len(filteredWords))
    print('===============')

    print("\nMost Used Words")

    # Feature 3



if __name__ == '__main__':
    
    url = 'https://www.lmu.de/de/newsroom/newsuebersicht/news/gruenden-mit-akademischem-rueckgrat.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
