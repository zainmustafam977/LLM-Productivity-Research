import re
import sys
import requests
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
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
    
    # 1: Convert content into a list of words by splitting at every whitespace character
    words = content.split()
    
    # 2: Calculate total number of words and print it out to the console
    num_words = len(words)
    print(f"Total number of words: {num_words}")
    
    # 3: Calculate total number of unique words and print it out to the console
    unique_words = set(words)
    num_unique_words = len(unique_words)
    print(f"Total number of unique words: {num_unique_words}")
    
    # 4: Calculate average length of the words and print it out to the console
    word_lengths = [len(word) for word in words]
    avg_word_length = sum(word_lengths) / num_words
    print(f"Average word length: {avg_word_length:.2f}")
  
    print("\n Stop Words")

    # 1: Create a list of German stopwords using NLTK
    german_stopwords = set(stopwords.words('german'))
    
    # 2: Filter out stopwords from the list of words
    words = content.split()
    filtered_words = [word for word in words if word.lower() not in german_stopwords]
    
    # 3: Calculate and print out the new number of words without stopwords
    num_filtered_words = len(filtered_words)
    print(f"Number of words without stopwords: {num_filtered_words}")
    
    print("\nMost Used Words")

    # 1: Count occurrences of each word and sort by frequency
    word_counts = {}
    for word in filtered_words:
        if word not in word_counts:
            word_counts[word] = 0
        word_counts[word] += 1
    sorted_word_counts = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
    
    # 2: Determine the 10 most used words and print them out to the console
    for word, count in sorted_word_counts[:10]:
        print(f"{word}: {count}")




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
