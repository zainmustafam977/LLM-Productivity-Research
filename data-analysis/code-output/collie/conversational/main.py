import re
import sys
import requests
from bs4 import BeautifulSoup
from collections import Counter
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


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
    analyze_text(content)
  
    print("\n Stop Words")
    german_stopwords = stopwords.words('german')
    words = content.split()
    filteredWords = [word for word in words if word.lower() not in german_stopwords]
    print("Number of words without stopwords:", len(filteredWords))
    
    print("\nMost Used Words")
    from collections import Counter
    
    # Count occurrences of each word in the list
    word_counts = Counter(filteredWords)
    
    # Sort the resulting dictionary by how often a word occurs
    sorted_word_counts = dict(sorted(word_counts.items(), key=lambda item: item[1], reverse=True))
    
    # Determine the 10 most used words and print them out to the console
    most_common_words = list(sorted_word_counts.keys())[:10]
    print("The 10 most common words are:")
    for word in most_common_words:
        print(f"{word}: {sorted_word_counts[word]}")
    
    # Feature 3

def analyze_text(text):
    # Split the text into words
    words = text.split()

    # Calculate the total number of words
    num_words = len(words)
    print("Total number of words:", num_words)

    # Calculate the total number of unique words
    unique_words = set(words)
    num_unique_words = len(unique_words)
    print("Total number of unique words:", num_unique_words)

    # Calculate the average length of the words
    total_word_length = sum(len(word) for word in words)
    avg_word_length = total_word_length / num_words
    print("Average word length:", avg_word_length)



if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
