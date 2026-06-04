import re
import sys
import requests
from bs4 import BeautifulSoup
from collections import Counter
from nltk.corpus import stopwords

# Function to scrape text content from a given URL
def scrapeURL(url):
    response = requests.get(url)
    html_content = response.content.decode('utf-8') 
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()

    # Clean up the text by removing punctuation, converting to lowercase, and removing newlines and tabs
    clean_text = re.sub(r'[^\w\s\.]', '', text)
    clean_text = clean_text.lower()
    clean_text = clean_text.replace('\n', '')
    clean_text = clean_text.replace('\t', '')
    clean_text = re.sub(' +', ' ', clean_text)

    return clean_text

# Function to output the URL and preview of the scraped content
def outputContent(content):

    print("\nLink to Article")
    print(url)
    print("\nContent Preview")
    print(content[:500] + "...")

# Function to perform text analysis on the given content
def outputAnalysis(content):
    print("\nText Analysis")
    
    # Split content into list of words
    words = content.split()
    
    # Feature 1: Total number of words
    num_words = len(words)
    print(f"\nTotal number of words: {num_words}")
    
    # Feature 2: Total number of unique words
    unique_words = set(words)
    num_unique_words = len(unique_words)
    print(f"Total number of unique words: {num_unique_words}")
    
    # Feature 3: Average length of words
    total_word_length = sum(len(word) for word in words)
    avg_word_length = total_word_length / num_words
    print(f"Average word length: {avg_word_length:.2f}")
    
    # Feature 4: Stop Words
    print("\nStop Words")
    german_stopwords = set(stopwords.words('german'))
    filtered_words = [word for word in words if word not in german_stopwords]
    num_filtered_words = len(filtered_words)
    print(f"Number of words without stopwords: {num_filtered_words}")
    
    # Feature 5: Most Used Words
    print("\nMost Used Words")
    word_counts = Counter(filtered_words)
    top_words = word_counts.most_common(10)
    for word, count in top_words:
        print(f"{word}: {count}")

if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)