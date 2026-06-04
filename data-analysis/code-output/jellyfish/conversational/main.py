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

    # Feature 1: Total number of words
    words = content.split()
    total_words = len(words)
    print("Total number of words:", total_words)

    # Feature 2: Total number of unique words
    unique_words = set(words)
    total_unique_words = len(unique_words)
    print("Total number of unique words:", total_unique_words)

    # Feature 3: Average length of words
    total_characters = sum(len(word) for word in words)
    average_length = total_characters / total_words
    print("Average length of words:", average_length)

    # Feature 4: Number of words without stopwords
    german_stopwords = stopwords.words('german')
    filtered_words = [word for word in words if word.lower() not in german_stopwords]
    num_words_without_stopwords = len(filtered_words)
    print("Number of words without stopwords:", num_words_without_stopwords)

    # Feature 5: Top 10 most used words
    word_counts = Counter(filtered_words)
    top_10_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    print("\nTop 10 most used words:")
    for word, count in top_10_words:
        print(f"{word}: {count}")




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
