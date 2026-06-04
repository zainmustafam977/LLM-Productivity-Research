#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def newX(x):
    newX = x + 150     # Feature 2
    return newX

def newY(y):
    height = 3508
    newY = height-y-250     # Feature 2
    return newY

def createPDF(title, link, summary):

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)

    # Feature 1, 
     
    # Draw the title string at position x=0 and y=0
    pdf.drawString(newX(0), newY(0), title)

    # Draw the link string at position x=0 and y=100
    pdf.drawString(newX(0), newY(100), link)

    # Draw the summary string at position x=0 and y=200
    #pdf.drawString(newX(0), newY(200), summary)
    
    # Feature 2, Feature 3

    words = summary.split()
    line = ""
    lines = []

    for word in words:
        if len(line + " " + word) <= 100:
            line += " " + word
        else:
            lines.append(line.strip())
            line = word

    lines.append(line.strip())

    y = 200
    for line in lines:
        pdf.drawString(newX(0), newY(y), line)
        y += 40

    pdf.drawString(newX(0), newY(y), lines[-1])




    pdf.save()

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

