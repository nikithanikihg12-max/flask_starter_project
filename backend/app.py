from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///simple.db'
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200))
    completed = db.Column(db.Boolean, default=False) 

with app.app_context():
    db.create_all()

@app.route('/todos', methods=['GET'])
def get_tasks():
    tasks = Todo.query.all()
    return jsonify([{"id": t.id, "text": t.text, "completed": t.completed} for t in tasks])

@app.route('/todos', methods=['POST'])
def add_task():
    data = request.json
    new_task = Todo(text=data['text'], completed=False)
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"id": new_task.id, "text": new_task.text, "completed": new_task.completed})

@app.route('/todos/<int:id>', methods=['PUT'])
def update_task(id):
    task = Todo.query.get(id)
    if task:
        task.completed = not task.completed 
        db.session.commit()
        return jsonify({"id": task.id, "text": task.text, "completed": task.completed})
    return {"error": "Not found"}, 404

@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Todo.query.get(id)
    db.session.delete(task)
    db.session.commit()
    return {"status": "success"}

if __name__ == '__main__':
    app.run(debug=True)
