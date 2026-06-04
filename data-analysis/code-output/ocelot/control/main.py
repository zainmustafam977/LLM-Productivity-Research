import re
import sys
import requests
import numpy as np
from bs4 import BeautifulSoup
from collections import Counter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

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

    mylist = content.split(' ')
    print(len(mylist))
    uniquelist = np.unique(np.array(mylist))
    print(len(uniquelist))
    print(sum(map(len, mylist))/ len(mylist))
    
  
    print("\n Stop Words")

    filteredList = []
    # Feature 2
    stop_words = set(stopwords.words('german'))
    for item in mylist:
        if(item not in stop_words):
            filteredList.append(item)

    print(len(filteredList))
    
    print("\nMost Used Words")

    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
