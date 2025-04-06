const request = require('supertest');
const http = require('http');

// Import your function handler from HelloWorld/index.js
const handler = require('../HelloWorld/index');

// Create a simple HTTP server that will call the Azure Function handler
const app = http.createServer((req, res) => {
    handler({ req, res }, {});  // Pass the request and response objects to the handler
});

describe('HelloWorld Function', () => {

    // Test 1: Check if the handler returns a 200 status code for a valid request
    it('should return 200 status code when the request is valid', async () => {
        const response = await request(app).get('/'); // Sending GET request
        expect(response.statusCode).toBe(200); // Assert that the status is 200
    });

    // Test 2: Verify the response text
    it('should return "Hello, World!" in the response body', async () => {
        const response = await request(app).get('/'); // Sending GET request
        expect(response.text).toBe('Hello, World!'); // Assert the response body
    });

    // Test 3: Handle edge case (e.g., non-existent route)
    it('should return 404 for a non-existent route', async () => {
        const response = await request(app).get('/non-existent'); // Request an unknown path
        expect(response.statusCode).toBe(404); // Expect 404 for non-existent route
    });

    // Test 4: Check if the query parameter is handled correctly
    it('should return the name from query string', async () => {
        const response = await request(app).get('/?name=Shiron'); // Request with query string
        expect(response.statusCode).toBe(200); // Status code should be 200
        expect(response.text).toBe('Hello, Shiron'); // Response should include the name
    });

    // Test 5: Test missing query parameter
    it('should return 400 if name is missing in query string', async () => {
        const response = await request(app).get('/'); // Request without a query string
        expect(response.statusCode).toBe(400); // Should return 400 when name is missing
        expect(response.text).toBe('Please pass a name on the query string or in the request body'); // Response should ask for a name
    });

});