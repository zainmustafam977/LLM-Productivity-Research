#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def NewX(x):
    newX = x + 150  # Move x-coordinate 150 pixels to the right
    return newX

def NewY(y):
    newY = 3508 - y - 250  # Invert y-coordinate and move it 250 pixels towards the bottom
    return newY


def createPDF(title, link, summary):

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)

    # Feature 1,2
    # Set up initial position
    x = 50
    y = 750
    
    # Draw title with padding on top
    pdf.drawString(x, y+50, title)
    
    # Move down to next line
    y = NewY(y, -100)
    
    # Draw link
    pdf.drawString(x, y, link)
    
    # Move down to next line
    y = NewY(y, -100)
    
    # Draw summary
    pdf.drawString(x, y, summary)



    pdf.save()

#Feature 3
def outputinConsole(title, link, summary):
    words = summary.split()  # Split summary into a list of words
    print("\nTitle: " + title)
    print("Link: " + link)
    print("Words in Summary: " + str(len(words)))  # Print number of words in summary
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

