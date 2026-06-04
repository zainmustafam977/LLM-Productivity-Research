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
    # Convert the content into a list of words by splitting it at every whitespace character.
    words = content.split()
    # Calculate the total number of words
    total_words = len(words)
    print("Total Words: " + str(total_words))
    # Calculate the total number of unique words
    unique_words = len(set(words))
    print("Unique Words: " + str(unique_words))
    # Calculate the average word length
    total_word_length = sum([len(word) for word in words])
    average_word_length = total_word_length / total_words
    print("Average Word Length: " + str(average_word_length))
    
  
    print("\n Stop Words")

    # Feature 2

    # Create a list of German stopwords by using the stopwords function from the package nltk
    stop_words = stopwords.words('german')
    # Create a list of words that are not stopwords
    filteredWords = [word for word in words if word not in stop_words]
    # Calculate the total number of words without stopwords
    total_filteredWords = len(filteredWords)
    print("Total Words without Stopwords: " + str(total_filteredWords))

    
    print("\nMost Used Words")

    # Feature 3

    # Use the filteredWords list and count the occurrences of each word (= item) in that list.
    word_counts = Counter(filteredWords)
    # Sort the resulting dictionary by how often a word occurs. The most common words should be at the beginning at the least common words at the end.
    sorted_word_counts = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
    # Print the 10 most common words and their number of occurrences, as a list, key left, value right
    for word, count in sorted_word_counts[:10]:
        print(word+":", count)





if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
