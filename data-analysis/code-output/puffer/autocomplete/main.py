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
    print("\nWord Count")
    print(len(content.split(" ")))
    print("\nUnique Word Count")
    print(len(set(content.split(" "))))
    print(("\naverage word length"))
    print(sum(map(len, content.split())) / len(content.split()))
    
    # Feature 1
    
    stop_words = set(stopwords.words('english'))
    

    filtered_list = [word for word in content.split() if word not in stop_words]
    print("\n Stop Words: ", len(filtered_list))
    

    # Feature 2
    
    print("\nMost Used Words")
    # count occurences of filtered words
    wordcount = Counter(filtered_list)
    # sort by occurence
    sorted_words = sorted(wordcount.items(), key=lambda x: x[1], reverse=False)
    # print top 10
    for word in sorted_words[:10]:
        print(word[0], ":", word[1])


    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
