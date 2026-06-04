#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def newX(x):
    
    newX = x     # Feature 2
    # Change the NewX function so that the x-coordinate is moved 150 pixels to the right.
    newX = x + 150
    
    return newX

def newY(y):
    height = 3508
    newY = y     # Feature 2
    # Change the NewY function so that the y-coordinate gets inverted (0 is at the top of the document and the max height of 3508 is at the bottom). Additionally, the function should always move the y-coordinate 250 pixel towards the bottom.
    newY = height - y - 250
    
    return newY

def createPDF(title, link, summary):

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)

    # Feature 1, Feature 2, Feature 3
    # Draw the title string at position x=0 and y=0
    pdf.drawString(newX(0), newY(0), title)
    pdf.setFont("Helvetica", 20)
    pdf.drawString(newX(0), newY(100), link)
    pdf.setFont("Helvetica", 30)
    pdf.drawString(newX(0), newY(200), "Summary:")
    pdf.setFont("Helvetica", 20)
    pdf.drawString(newX(0), newY(300), summary)
    # anmerkung: hier ist mir als Nutzer nicht klar, ob der gesamte Code benötigt wird um die funktion zu erhalten, oder welche Teile Optional sind.ich habe nur den ersten Teil als anweisung gegeben, erhalte jedoch schon mehr code. Nach einem Kommentar wird mir u.a. ein weiterer Kommentar angezeigt. der code weiter unten ist dadurch redundant.

    # Draw the link string at position x=0 and y=100
    pdf.drawString(newX(0), newY(100), link)
    
    # Draw the summary string at position x=0 and y=200
    pdf.drawString(newX(0), newY(200), "Summary:")
    
    # Feature 3
    """ First, split the summary string into a list of its individual words. Then go through the words and add them back together one by one with spaces in between to build a line of text.
    During the process of adding the line together, check if adding the word increased the length of the line to over 100 characters. If that is the case, draw the line of text in the PDF and reset its contents to build the next line.
    Make sure that each time you draw a line of text, the y-coordinate of the text is increased so the lines are drawn out below each other.
    Also make sure that the last line which will not reach 100 characters is drawn into the PDF as well."""
    
    # anmerkung: zu lange kommentare führen zu keinem Ergebnis
    # vesuche es einzeln

    #  First, split the summary string into a list of its individual words. Then go through the words and add them back together one by one with spaces in between to build a line of text.
 
    words = summary.split(" ") 
    line = ""
    y = 300
    for word in words:
        line += word + " "
        if len(line) > 100:
            pdf.drawString(newX(0), newY(y), line)
            y += 100
            line = ""
    pdf.drawString(newX(0), newY(y), line)
       # During the process of adding the line together, check if adding the word increased the length of the line to over 100 characters. If that is the case, draw the line of text in the PDF and reset its contents to build the next line.
    

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

