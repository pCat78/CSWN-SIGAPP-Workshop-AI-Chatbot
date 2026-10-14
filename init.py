
    
 
"""Simple terminal chatbot using the OpenAI Responses API.


Install dependencies:
   python -m pip install openai python-dotenv


Create a .env file next to this script containing:
   OPENAI_API_KEY=your_api_key_here


Run:
   python chatbot.py
"""


import os


from dotenv import load_dotenv
from openai import OpenAI, OpenAIError




# Load the OPENAI_API_KEY value from your .env file.
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")


if not api_key:
   raise SystemExit("Missing OPENAI_API_KEY. Add it to a .env file.")


# Create the API client once and reuse it for every message.
client = OpenAI(api_key=api_key)




def chat():
   print("This is our chatbot. Type 'exit' to quit.\n")


   # Tracks the conversation so follow-up questions have context.
   previous_response_id = None


   while True:
       user_input = input("You: ").strip()


       if user_input.lower() == "exit":
           print("Goodbye!")
           break


       if not user_input:
           continue


       try:
           # Send the user's message to the OpenAI API.
           response = client.responses.create(
               model="gpt-5-nano",
               input=user_input,
               previous_response_id=previous_response_id,
               max_output_tokens=500,
           )
       except OpenAIError as error:
           print(f"API error: {error}\n")
           continue


       # Show the answer returned by the model.
       print("Chatbot:", response.output_text or "[No text returned]", "\n")


       # Save the response ID to keep the conversation going.
       previous_response_id = response.id




if __name__ == "__main__":
   chat()



