import re
import sys
import requests
from bs4 import BeautifulSoup
from collections import Counter
import nltk
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

    # Split the content into a list of words
    words = content.split()

    # Calculate the total number of words and print it out
    num_words = len(words)
    print("Total number of words:", num_words)

    # Calculate the total number of unique words and print it out
    unique_words = set(words)
    num_unique_words = len(unique_words)
    print("Total number of unique words:", num_unique_words)

    # Calculate the average length of the words and print it out
    total_length = sum(len(word) for word in words)
    avg_length = total_length / num_words
    print("Average length of words:", avg_length)
  
    print("\n Stop Words")

    # Feature 2

    # Create a list of German stopwords
    stop_words = set(stopwords.words('german'))

    # Filter out stopwords from the list of words
    filtered_words = [word for word in words if word.lower() not in stop_words]

    # Calculate the total number of words without stopwords and print it out
    num_filtered_words = len(filtered_words)
    print("Number of words without stopwords:", num_filtered_words)
    
    print("\nMost Used Words")

    # Feature 3

    # Count the occurrences of each word and store them in a dictionary
    word_counts = {}
    for word in filtered_words:
        if word in word_counts:
            word_counts[word] += 1
        else:
            word_counts[word] = 1
    
    # Sort the dictionary by how often a word occurs
    sorted_word_counts = {k: v for k, v in sorted(word_counts.items(), key=lambda item: item[1], reverse=True)}

    # Determine the 10 most used words and print them out to the console
    top_words = list(sorted_word_counts.keys())[:10]
    print("The 10 most used words are:")
    for word in top_words:
        print(word+': '+str(sorted_word_counts[word]))




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
