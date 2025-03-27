from flask import Blueprint, request, jsonify, session
from Models.database import get_db_connection 
from Utils.hashed_passwords import hash_password, check_password

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
        
        