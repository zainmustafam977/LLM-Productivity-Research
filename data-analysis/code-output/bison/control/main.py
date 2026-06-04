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


def outputAnalysis(content):

    print("\nText Analysis")
    
    # Feature 1
    """Convert the content into a list of words by splitting it at every whitespace character.
    Calculate the total number of words and print it out to the console.
    Calculate the total number of unique words and print it out to the console.
    Calculate the average length of the words and print it out to the console"""
    wordlist = content.split( )
    # []
    tokens = ntlk.tokenize.word_tokenize(wordlist)
    filtered_word_freq = dict
    
    # wenn man nicht mit windows arbeitet, scheitert es schon an den Tastenkombinationen...

  
    print("\n Stop Words")

    # Feature 2
    
    print("\nMost Used Words")

    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
