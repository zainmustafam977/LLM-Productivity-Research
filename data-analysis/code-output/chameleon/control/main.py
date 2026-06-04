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
    word=0
    for i in range (0, len(content)-1):
        if(content[i] == ' ' and content[i+1].isalpha() and (i > 0)):  
            word=word+1

    print(word)

    un=content.disctint().count()

    print("Unique Words")
    print(un)

    x=[]
    for i in content:
        x.append(len(i))

    m=x.mean()

    print("Avg Length is:")
    print(m)

    print("\n Stop Words")

    # Feature 2

    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize


    stops = set(stopwords.words('german'))
    print(stops)
    print(stops.len())

    word_tokens = word_tokenize(stops)
    # converts the words in word_tokens to lower case and then checks whether
    #they are present in stop_words or not
    filtered_sentence = [w for w in word_tokens if not w.lower() in stop]
    #with no lower case conversion
    filtered_sentence = []
    
    for w in word_tokens:
        if w not in stops:
            filtered_sentence.append(w)
    
    print(word_tokens)
    print(filtered_sentence)


    
    print("\nMost Used Words")

    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
