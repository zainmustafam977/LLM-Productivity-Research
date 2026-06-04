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
    wordArray = content.split(" ")
    #"Total number of words: " + 
    print(len(wordArray));

    uniqueWords = set(wordArray);
    print(len(uniqueWords))


    temp = [len(ele) for ele in wordArray]
    res = 0 if len(temp) == 0 else (float(sum(temp)) / len(temp))
    
    # printing result
    print("The Average length of String in list is : " + str(res))





    print("\n Stop Words")
    # Feature 2


    stopWordList = stopwords.
    
    print("\nMost Used Words")

    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
