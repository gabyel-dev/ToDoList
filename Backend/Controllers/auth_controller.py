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
        
        check_user_pass = check_password(user['password'], password)
        
        if user is None or not check_user_pass:
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
        
        cursor.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (username, hashed_password))
        conn.commit()
        
        if cursor.rowcount > 0:
            return jsonify({'message': 'user registered succesfully', 'redirect': '/login'}), 200
    except Exception as e:
        return jsonify({'error': 'registration failed', 'details': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

#check user session
@auth_bp.route('/user', methods=['GET'])
def check_session():
    return jsonify({'user': session.get('user'), 'logged_in': "user" in session, 'redirect': '/dashboard' if 'user' in session else '/'}), 200
        
        