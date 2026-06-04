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

    all_words = content.split(" ")

    print("\nText Analysis")
    
    # Feature 1
    print("\n Total number of words: {}".format(len(all_words)))
    print("\n Total number of unique words: {}".format(len(set(all_words))
))
    temp = [len(ele) for ele in all_words]
    res = 0 if len(temp) == 0 else (float(sum(temp)) / len(temp))
    print("\n Average length of words: {}".format(str(res))
)
    

    # Feature 2

    print("\n Stop Words")
    german_stop_words = stopwords.words('german')
    filtered_words = [word for word in all_words if word not in german_stop_words]
    print("\n Number of words without stopwords: {}".format(len(filtered_words)))

    # Feature 3

    print("\nMost Used Words")
    print(filtered_words.count(1))


if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
