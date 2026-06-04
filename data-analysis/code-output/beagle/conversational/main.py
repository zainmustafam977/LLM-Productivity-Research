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

def word_stats(input_string):
    # Split the input string into a list of words
    words = input_string.split()

    wordlist_stats(words)

def word_stats_wo_stopwords(input_string):
    words = input_string.split()
    stop_words = stopwords.words('german')

    filteredWords = [word for word in words if word not in stop_words]
    # Print the number of words
    print("Number of words without stopwords:", len(filteredWords))
    return filteredWords


def word_counter(filteredWords):

    # Count the occurrences of each word
    word_counts = Counter(filteredWords)
    
    # Sort the words by decreasing count
    sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Print the 10 most common words
    for word, count in sorted_words[:10]:
        print(f'{word}: {count}')
    

def wordlist_stats(words):

    # A cat sat down to count some words,
    # Its eyes fixed on the screen like birds.
    # With paws that typed and whiskers twitched,
    # It counted every word, not a one was ditched.
    
    # The cat was smart and quite adept,
    # At counting words it had no concept.
    # It sorted them by frequency,
    # And printed out the top ten with glee.
    
    # The words were many, but the cat was quick,
    # And soon it found the ones that stuck.
    # It meowed in triumph, oh so proud,
    # For it had done its job, and done it loud.
    
    # So if you need some words to count,
    # Just call upon this feline mount.
    # It'll sort them out without delay,
    # And make sure they're all in display.


    # Print the number of words
    print("Number of words:", len(words))

    # Create a set of unique words
    unique_words = set(words)

    # Print the number of unique words
    print("Number of unique words:", len(unique_words))

    # Calculate the total length of all words
    total_length = sum(len(word) for word in words)

    # Calculate the average length of words
    avg_length = total_length / len(words)

    # Print the average length of words
    print("Average length of words:", avg_length)


def outputAnalysis(content):

    print("\nText Analysis")
    
    word_stats(content)
    print("\nStop Words")

    filteredWords = word_stats_wo_stopwords(content)
    
    print("\nMost Used Words")

    word_counter(filteredWords)



if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
