import os 
from dotenv import load_dotenv

load_dotenv()

class Config:
    DB_URL = os.getenv('DB_URL')
    SECRET_KEY = os.getenv('SECRET_KEY')
    SESSION_PERMANENT = True
    SESSION_TYPE = 'filesystem'
    SESSION_USE_SIGNER = True   
    SESSION_KEY_PREFIX = "flask_session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_NAME = 'session_cookies'
    SESSION_COOKIE_SECURE = os.getenv('FLASK_ENV') == 'production'