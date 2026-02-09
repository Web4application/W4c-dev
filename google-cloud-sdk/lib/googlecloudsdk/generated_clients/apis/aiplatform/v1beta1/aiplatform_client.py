from google.cloud import aiplatform_v1beta1

# Initialize the client for a specific service
# Note: You must specify the api_endpoint for your region (e.g., us-central1)
client_options = {"api_endpoint": "us-central1-aiplatform.googleapis.com"}
client = aiplatform_v1beta1.PredictionServiceClient(client_options=client_options)

# Define your resource name
endpoint = "projects/[PROJECT_ID]/locations/us-central1/endpoints/[ENDPOINT_ID]"

# Example: Sending a prediction request
# (Structure varies depending on the model/service)
response = client.predict(
    endpoint=endpoint,
    instances=[{"content": "Hello, how can I use this API?"}]
)
