import functools
import jwt
from flask import request, jsonify
from cognito_helper import get_cognito_public_keys

COGNITO_USER_POOL_ID = 'us-east-1_XzMV761hP'
COGNITO_REGION = 'us-east-1'

public_keys = get_cognito_public_keys(COGNITO_USER_POOL_ID, COGNITO_REGION)

def token_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify(message='Missing token'), 403
        
        try:
            # Validate and decode the token
            header = jwt.get_unverified_header(token)
            public_key = public_keys[header['kid']]
            decoded = jwt.decode(token, public_key, algorithms=['RS256'], audience=COGNITO_USER_POOL_ID)
        except Exception as e:
            return jsonify(message=str(e)), 403
        
        return f(*args, **kwargs)
    
    return decorated_function
