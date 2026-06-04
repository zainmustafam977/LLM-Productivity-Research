#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def newX(x):
    newX = x     # Feature 2
    return newX

def newY(y):
    height = 3508
    newY = y     # Feature 2
    return newY

def createPDF(title, link, summary):

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)


    # Feature 1, Feature 2, Feature 3

    # feature 1
    # pdf.drawString(0, 0, title)
    # pdf.drawString(0, 100, link)
    # pdf.drawString(0, 200, summary)

    #f2
    # pdf.drawString(150, 0, title)
    # pdf.drawString(150, 100, link)
    # pdf.drawString(150, 200, summary)

    pdf.drawString(150, 3508 - 250, title)
    pdf.drawString(150, 3508 - 250 - 100, link)
    pdf.drawString(150, 3508 - 250 - 200, summary)

    # f3
    y = 700
    words = summary.split()
    line = ""
    for word in words:
        # Add the current word to the line with a space if the line is not empty
        if line != "":
            line += " "
        line += word
    
    # Check if adding the word increased the length of the line to over 100 characters
    if len(line) > 100:
        # Draw the line of text in the PDF
        pdf.drawString(50, y, line)
        
        # Reset the line variable to build the next line
        line = ""
        
        # Increase the y-coordinate for the next line
        y -= 20



    pdf.save() #Saves the pdf in the same folder as the main.py file

def outputinConsole(title,link,summary):
    print("\nTitle: " + title)
    print("Link: " + link)
    print("Summary: " + summary[:300] + "...")

if __name__ == '__main__':

    search_term = input("\nEnter search term: ")

    try:
        page = wikipedia.page(search_term)
        print("Topic was found.")
        outputinConsole(page.title, page.url, page.summary)
        createPDF(page.title, page.url, page.summary)
    except wikipedia.exceptions.DisambiguationError as e:
        print("The search term is ambigious. Please select a specific topic.")
        options = '\n'.join(e.options)
        print(options)
    except wikipedia.exceptions.PageError as e:
        print("The search term did not lead to any matches.")

