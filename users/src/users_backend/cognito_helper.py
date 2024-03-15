import requests
import json

def get_cognito_public_keys(user_pool_id, region):
    url = f'https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json'
    response = requests.get(url)
    if response.status_code == 200:
        return json.loads(response.text)
    else:
        raise ValueError('Error fetching public keys from Cognito')
