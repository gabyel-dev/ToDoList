from flask import Blueprint, request, jsonify, session
from Models.database import get_db_connection 
from Utils.hashed_passwords import hash_password, check_password
from datetime import datetime

auth_bp = Blueprint('auth', __name__)


#login implementation
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        user = cursor.fetchone()
        
        if user is None or not check_password(user['password'], password):
            return jsonify({'error': 'Invalid Credentials'}), 401
        
        session['user'] = user['id']
        return jsonify({'message': 'logged in successful', 'redirect': '/dashboard'}), 200
    
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500
    
    finally:
        cursor.close()
        conn.close()
        
#register implementation
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT username FROM users WHERE username = %s', (username,))
        user = cursor.fetchone()
        
        if user:
            return jsonify({'message': 'username already used'}), 409
        
        hashed_password = hash_password(password)
        
        if len(password) < 8:
            return jsonify({'message': 'password must be atleast 8 characters long'}), 400
        
        cursor.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (username, hashed_password))
        conn.commit()
        
        if cursor.rowcount > 0:
            return jsonify({'message': 'user registered succesfully', 'redirect': '/login'}), 200
    except Exception as e:
        return jsonify({'error': 'registration failed', 'details': str(e)}), 500
    finally:
        cursor.close()
    if conn:
        conn.close()
        
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    username, password, new_password = data.get('username'), data.get('password'), data.get('newPassword')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT password FROM users WHERE username = %s', (username,))
        user = cursor.fetchone()

        # Check if user exists and password is correct
        if not user or not check_password(user['password'], password):
            return jsonify({'error': 'Invalid username or password'}), 401

        # Validate new password
        if check_password(user['password'], new_password) or len(new_password) < 8:
            error_msg = 'New password must be different' if check_password(user['password'], new_password) else 'Password must be at least 8 characters long'
            return jsonify({'error': error_msg}), 400

        # Update password
        hash_new_password = hash_password(new_password)
        cursor.execute('UPDATE users SET password = %s WHERE username = %s', (hash_new_password, username))

        if cursor.rowcount == 0:
            return jsonify({'error': 'Password update failed'}), 400

        conn.commit()
        return jsonify({'message': 'Password updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to reset password', 'details': str(e)}), 500

    finally:
        cursor.close()
        conn.close()
        
#logout functionality
@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'logged out successfully', 'redirect': '/'})

#check user session
@auth_bp.route('/user', methods=['GET'])
def check_session():
    return jsonify({'user': session.get('user'), 'logged_in': "user" in session, 'redirect': '/dashboard' if 'user' in session else '/'}), 200


########################
# TASKS FUNCTIONALITY #
#######################
@auth_bp.route('/create_task', methods=['POST'])
def add_tasks(): 
    data = request.get_json()
    userID = session['user']
    taskTITLE = data.get('title')
    taskDESC = data.get('description')
    taskPRIO = data.get('prio')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
            '''
            INSERT INTO tasks (user_id, title, description, priority) 
            VALUES (%s, %s, %s, %s) 
            RETURNING id, user_id, title, description, status, created_at, priority
            ''',
            (userID, taskTITLE, taskDESC, taskPRIO)
        )
    new_task = cursor.fetchone()
    
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify(new_task)


#get all tasks
@auth_bp.route('/get_all/<int:id>', methods=['GET'])
def get_tasks(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('SELECT id, title, description, status, created_at, priority FROM tasks WHERE user_id = %s', (id,))
        tasks = cursor.fetchall()

        return jsonify(tasks)
    except Exception as e:
        return jsonify({'error': 'Error fetching tasks', 'details': str(e)})
    finally:
        cursor.close()
        conn.close()
        
@auth_bp.route('/task/<int:id>', methods=['GET'])
def get_task(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT id, title, description, status, created_at, priority FROM tasks WHERE id = %s', (id,))
        task = cursor.fetchone()
  

        if not task:
            print(f"Task with ID {id} not found")  # Debugging
            return jsonify({'error': 'Task not found'}), 404  # Return proper 404 response

        print(f"Task found: {task}")  # Debugging
        return jsonify(task)
    except Exception as e:
        print(f"Error fetching task: {e}")  # Debugging
        return jsonify({'error': 'Error fetching task', 'details': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
        
@auth_bp.route('/delete/<int:id>', methods=['DELETE'])
def delete(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('DELETE FROM tasks WHERE id = %s', (id,))
        conn.commit()
        
        return jsonify({'message': 'task deleted successfully'})
        
    except Exception as e:
        return jsonify({'error': 'Error fetching tasks', 'details': str(e)})
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/update/<int:id>', methods=['POST'])
def update_task(id):
    data = request.get_json()
    taskTITLE = data.get('title')
    taskDESC = data.get('description')
    taskSTATUS = data.get('status')
    taskPRIO = data.get('prio')
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('UPDATE tasks SET title = %s, description = %s, status = %s, priority = %s WHERE id = %s', (taskTITLE, taskDESC, taskSTATUS, taskPRIO, id))
        conn.commit()
        
        return jsonify({'message': 'task updated successfully'}), 200
    except:
        return jsonify({'error': 'task failed to update'}), 500
    finally:
        cursor.close()
        conn.close()

@auth_bp.route('/search')
def search():
    conn = get_db_connection()
    cursor = conn.cursor()
    query = request.args.get('q', "").strip()  # Trim input to avoid errors
    user_id = request.args.get('user_id', "")

    try:
        cursor.execute('SELECT id, title FROM tasks WHERE user_id = %s AND title ILIKE %s', (user_id, f"%{query}%",))
        result = cursor.fetchall()


        return jsonify([{'id': row['id'], 'title': row['title']} for row in result])


    except Exception as e:

        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()



        