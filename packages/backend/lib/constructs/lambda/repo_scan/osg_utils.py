import os
import urllib3
import json
import boto3
from io import BytesIO

class engine():
    def __init__(self, gh_api_key=None):
        # gh_api_key is optional so that users can pass the api token from other sources other than env variables. Ex: AWS secret manager
        self.gh_api_key = gh_api_key
        self.http = urllib3.PoolManager()

    def request(self, url):
        # Set up headers with authentication
        headers = {
            "Authorization": f"token {self.gh_api_key}",
            "Accept": "application/vnd.github+json"
        }
        # Make GET request to fetch user repositories
        print(f'Attempting call to URL: {url}')
        try:
            r = self.http.request('GET', url, headers=headers)
            if r.status == 200:
                print(f'Call successful {r.status}!')
            else:
                print(f'Call failed with the following code: {r.status}')
            results = json.loads(r.data.decode('utf-8'))
            pretty_json = json.dumps(results, indent=4)
            return pretty_json
        except Exception as e:
            print(f'Error making request: {str(e)}')
            return None
        
def write_data_to_s3(df,s3_bucket_location,folder,keyname):
    s3_client = boto3.client('s3')
    buffer = BytesIO()
    df.to_csv(buffer, index=False)
    buffer.seek(0)
    s3_client.put_object(
        Bucket=s3_bucket_location,
        Key=keyname,
        Body=buffer.getvalue()
    )
    return 'Loaded {keyname} to {s3_bucket_location}/{folder}/{keyname} successfully!'.format(keyname=keyname,s3_bucket_location=s3_bucket_location,folder=folder)



