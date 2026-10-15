"""Custom function tools, plus the hosted tool definitions from tools.json.

server.py imports TOOLS (to pass to client.responses.create) and
LOCAL_FUNCTIONS (to run a function tool once the model asks for it).
"""

import json
import os


# Custom function tool that we created.
def add(a, b):
    return a + b


# Maps the tool name the model asks for to the Python function that handles
# it. Add more entries here if you wire up additional custom functions.
LOCAL_FUNCTIONS = {"add": add}

# Tool definitions (what the model is told it can call) live in tools.json,
# next to this file, so the schema can be edited without touching the code.
with open(os.path.join(os.path.dirname(__file__), "tools.json")) as f:
    TOOLS = json.load(f)
