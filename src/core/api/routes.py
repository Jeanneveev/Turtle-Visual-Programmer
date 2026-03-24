from flask import Blueprint, request, jsonify
from src.core.context.context import init_context
from src.core.parser.parser import json_to_instructions
from src.core.runner.runner import Runner

api = Blueprint("api", __name__, url_prefix="/api")

@api.route("/run", methods=["POST"])
def run():
    data = request.get_json()

    block_instruction = json_to_instructions(data)

    action_stream = block_instruction.to_actions()

    context = init_context()
    runner = Runner(context)
    runner.load_actions(action_stream)
    state_trace = runner.run()

    return jsonify(state_trace)