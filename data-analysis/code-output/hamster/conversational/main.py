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

def count_word_frequency(word_list):
    word_frequency = {}
    for word in word_list:
        if word in word_frequency:
            word_frequency[word] += 1
        else:
            word_frequency[word] = 1
    return word_frequency

# Example usage



def outputAnalysis(content):

    print("\nText Analysis")
    word_list = content.split()
    word_count = len(word_list)
    print(f"word count: {word_count}")
    unique_words = set(word_list)

    count_unique_words = len(unique_words)

    print(f"unique word count: {count_unique_words}")
    total_length = 0
    for word in word_list:
        
        total_length += len(word)

    average_length = total_length / word_count

    print(f"avg length: {average_length}")
    # Feature 1

  
    print("\n Stop Words")

    # Feature 2
    stopwords_list = set(stopwords.words('english'))

    # print(stopwords_list)
    filtered_words = [word for word in word_list if word.lower() not in stopwords_list]
    print(f"filtered words: {len(filtered_words)}")
    freq = count_word_frequency(filtered_words)
    for w in sorted(freq)[:10]:
        print(w)
    print("\nMost Used Words")

    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
