#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def newX(x):
    newX = x + 150  # Move x-coordinate 150 pixels to the right
    return newX

def newY(y):
    height = 3508
    newY = height - y - 250  # Invert y-coordinate and move it 250 pixels towards the bottom
    return newY


def createPDF(title, link, summary):

    pdf = canvas.Canvas(title + ".pdf")
    pdf.setPageSize((2480, 3508))
    pdf.setFont("Helvetica", 40)

    # Draw title at (x=0, y=0)
    pdf.drawString(newX(0), newY(0), title)

    # Draw link at (x=0, y=100)
    pdf.drawString(newX(0), newY(100), link)

    # Draw summary at (x=0, y=200)
    summary_words = summary.split()  # Split summary string into a list of words
    line = ""  # Variable to build each line of text

    y = 200  # Initial y-coordinate for the first line of text

    for word in summary_words:
        if len(line) == 0:  # Check if the line is empty
            line = word  # Start the line with the current word
        elif len(line) + len(word) + 1 > 100:  # Check if adding the word exceeds 100 characters
            pdf.drawString(newX(0), newY(y), line)  # Draw the line of text
            line = word  # Start a new line with the current word
            y += 40  # Increase y-coordinate for the next line of text
        else:
            line += " " + word  # Add word to the current line with a space

    pdf.drawString(newX(0), newY(y), line)  # Draw the last line of text

    pdf.save()
#Saves the pdf in the same folder as the main.py file

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

