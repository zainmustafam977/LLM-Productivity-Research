import re
import sys
import requests
from bs4 import BeautifulSoup
from collections import Counter
from nltk.corpus import stopwords
import nltk
nltk.download('stopwords')

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
    words = content.split()
    print(words)

    num_words = len(words)
    print(f"Total number of words: {num_words}")

    unique_words = set(words)
    num_unique_words = len(unique_words)
    print(f"Total number of unique words: {num_unique_words}")

    total_word_length = sum(len(word) for word in words)
    avg_word_length = total_word_length / num_words
    print(f"Average word length: {avg_word_length:.2f}")
  
    print("\n Stop Words")

    # Feature 2
    german_stopwords = stopwords.words('german')
    print(german_stopwords)

    filteredWords = [word for word in words if word.lower() not in german_stopwords]
    print(filteredWords)


    print("\nMost Used Words")

    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
