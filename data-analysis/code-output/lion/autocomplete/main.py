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
    # split content at every whitespace
    words = content.split()
    print(len(words))
    #calculate number of unique words
    unique_words = set(words)
    print (len(unique_words))
    #calculate average length of words and print
    word_lengths = []
    for word in words:
        word_lengths.append(len(word))
    print(sum(word_lengths)/len(word_lengths))

    # Feature 1
  
    print("\n Stop Words")
    # get stop words from nltk
    stop_words = set(stopwords.words('german'))
    # remove stop words from content
    filtered_words = []
    for word in words:
        if word not in stop_words:
            filtered_words.append(word)
    # calculate number of unique words
    print(len(filtered_words))

    # Feature 2
    
    print("\nMost Used Words")
    # count words
    word_counts = Counter(filtered_words)
    #sort words by count
    sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
    #print top 10 words
    for word in sorted_words[:10]:
        print(word[0], word[1])
        

    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
