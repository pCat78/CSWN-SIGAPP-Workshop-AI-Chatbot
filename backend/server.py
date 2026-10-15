"""Flask API wrapping the OpenAI chatbot for the React UI.

Install:  python -m pip install -U flask openai python-dotenv
.env:     OPENAI_API_KEY=your_openai_key
Run:      python server.py     (serves on http://127.0.0.1:5000)
"""

import json
import logging
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from openai import OpenAI, OpenAIError

from tools import LOCAL_FUNCTIONS, TOOLS

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise SystemExit("Missing OPENAI_API_KEY. Add it to a .env file.")

client = OpenAI(api_key=api_key)
app = Flask(__name__)
app.logger.setLevel(logging.INFO)  # Flask defaults to WARNING, which hides .info() logs
app.config["MAX_CONTENT_LENGTH"] = 32 * 1024  # reject oversized requests
MAX_MESSAGE_CHARS = 4000

# gpt-5-nano is a reasoning model: its hidden "thinking" tokens count against
# max_output_tokens. With a small limit (500) they can use the whole budget and
# leave no room for the visible answer, which showed up as "[No text returned]".
MAX_OUTPUT_TOKENS = 4000

# Safety cap so a confused model can't loop us into calling OpenAI forever.
MAX_FUNCTION_CALL_ROUNDS = 5

@app.get("/")
def hello_world():
    return "Hello World"

@app.post("/api/chat")
def chat():
    data = request.get_json(silent=True) or {}
    user_input = (data.get("message") or "").strip()
    previous_response_id = data.get("previous_response_id")  # keeps context

    if not user_input:
        return jsonify({"error": "Message is empty."}), 400
    if len(user_input) > MAX_MESSAGE_CHARS:
        return jsonify({"error": "Message is too long."}), 400
    if previous_response_id is not None and not isinstance(previous_response_id, str):
        return jsonify({"error": "Invalid conversation ID."}), 400

    try:
        response = client.responses.create(
            model="gpt-5-nano",
            tools=TOOLS,
            include=["web_search_call.action.sources"],
            input=user_input,
            previous_response_id=previous_response_id,
            max_output_tokens=MAX_OUTPUT_TOKENS,
            reasoning={"effort": "low"},
        )

        # web_search is hosted: OpenAI runs it and hands back a finished
        # message. A "function" tool like add() is NOT run by OpenAI -- the
        # model instead returns one or more "function_call" output items and
        # waits. We have to execute them ourselves and send the results back
        # before the model can produce its final text reply.
        rounds = 0
        while rounds < MAX_FUNCTION_CALL_ROUNDS:
            calls = [item for item in response.output if item.type == "function_call"]
            if not calls:
                break
            rounds += 1

            outputs = []
            for call in calls:
                handler = LOCAL_FUNCTIONS.get(call.name)
                try:
                    args = json.loads(call.arguments)
                    arg_str = ", ".join(f"{key}={value!r}" for key, value in args.items())
                    app.logger.info("[TOOL] Running %s(%s)", call.name, arg_str)

                    if handler is None:
                        result = {"error": f"Unknown function: {call.name}"}
                    else:
                        result = handler(**args)
                except Exception as error:  # bad/missing args from the model
                    result = {"error": f"Could not run {call.name}: {error}"}

                outputs.append(
                    {
                        "type": "function_call_output",
                        "call_id": call.call_id,
                        "output": json.dumps(result),
                    }
                )

            # previous_response_id picks up the conversation where this
            # response left off, so we only need to send the function
            # results here -- not the original question again.
            response = client.responses.create(
                model="gpt-5-nano",
                tools=TOOLS,
                input=outputs,
                previous_response_id=response.id,
                max_output_tokens=MAX_OUTPUT_TOKENS,
                reasoning={"effort": "low"},
            )
    except OpenAIError as error:
        # Log details on the server; don't expose them to the browser.
        app.logger.error("OpenAI API error: %s", error)
        return jsonify({"error": "The chatbot could not respond. Try again."}), 502

    text = (response.output_text or "").strip()
    if not text:
        reason = getattr(response.incomplete_details, "reason", None)
        app.logger.error("Empty reply: status=%s reason=%s", response.status, reason)
        message = (
            "The model ran out of tokens before answering. Try a shorter question."
            if reason == "max_output_tokens"
            else "The chatbot returned no text. Try again."
        )
        return jsonify({"error": message}), 502

    return jsonify({"reply": text, "response_id": response.id})


if __name__ == "__main__":
    # Debug mode exposes an interactive debugger that can run code, so it stays
    # off unless you set FLASK_DEBUG=1 yourself. Bound to localhost only.
    app.run(host="127.0.0.1", port=5000, debug=os.getenv("FLASK_DEBUG") == "1")
