# ParseEmail
A Node microservice to accept the body of a URL, scrape the header of that destination, and then send values to a REST API

## Prerequisites

1. Install Node.js and npm on your machine.
2. Clone or download the API source code.
3. Run `npm install` in the project directory to install the dependencies.
4. Start the server using `node <filename>.js`.

The API will run on `http://localhost:3000` by default.

## Endpoint: `/api/parse-email`

### Method
`POST`

### Description
This endpoint accepts the body of an email, extracts the first link, scrapes the webpage for metadata (title and description), and sends the metadata to an external REST API.

### External API Endpoint
The external REST API endpoint is defined as a constant in the code (`API_ENDPOINT`). Update the value of `API_ENDPOINT` in the code to the desired endpoint.

### Request Body
The request must contain a JSON object with the following key:

- `emailBody` (string, required): The full text of the email containing one or more URLs.

#### Example
```json
{
  "emailBody": "Hello, check out this link: https://www.amazon.com/gp/video/detail/B0CH99VGR8/ref=atv_dp_share_cu_r"
}
```

### Response
A successful response returns a JSON object containing:

- `message` (string): A confirmation message indicating success.
- `apiResponse` (object): The response received from the external REST API.

#### Example
```json
{
  "message": "Meta data sent successfully.",
  "apiResponse": {
    "status": "success",
    "data": {
      "id": 12345,
      "title": "The Example Title",
      "description": "This is an example description of the webpage."
    }
  }
}
```

### Error Responses
If the request fails, the API returns an appropriate HTTP status code and a JSON error message:

- `400 Bad Request`: Missing or invalid input.
  ```json
  {
    "error": "emailBody is required."
  }
  ```
  ```json
  {
    "error": "No valid link found in email body."
  }
  ```

- `500 Internal Server Error`: An error occurred during processing.
  ```json
  {
    "error": "An error occurred while processing the request."
  }
  ```

## Testing the API
You can test the API using tools like [Postman](https://www.postman.com/) or `curl`.

### Example Using `curl`
```bash
curl -X POST http://localhost:3000/api/parse-email \
-H "Content-Type: application/json" \
-d '{"emailBody": "Hello, check out this link: https://www.amazon.com/gp/video/detail/B0CH99VGR8/ref=atv_dp_share_cu_r"}'
```

### Example Using Postman
1. Open Postman and create a new `POST` request.
2. Set the URL to `http://localhost:3000/api/parse-email`.
3. Under the **Body** tab, select **raw** and set the type to **JSON**.
4. Enter the following JSON:
   ```json
   {
     "emailBody": "Hello, check out this link: https://www.amazon.com/gp/video/detail/B0CH99VGR8/ref=atv_dp_share_cu_r"
   }
   ```
5. Send the request and observe the response.

## Notes
- Ensure the server is running before making requests.
- The API only extracts the first valid link found in the email body.
- The extracted webpage must be publicly accessible for the API to retrieve metadata.
- Update `API_ENDPOINT` in the source code to specify the external API where metadata should be sent.

