const request = require('supertest');
const http = require('http');
const url = require('url');

// Import your function handler from HelloWorld/index.js
const handler = require('../src/HelloWorld/index');

// Create a simple HTTP server that will call the Azure Function handler
const app = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const context = {
        res: {
            status: 200,
            body: '',
            set: (key, value) => {
                res.setHeader(key, value);
            }
        }
    };
    
    const azureReq = {
        query: parsedUrl.query,
        method: req.method,
        url: req.url,
        headers: req.headers
    };

    handler(context, azureReq).then(() => {
        res.statusCode = context.res.status;
        res.end(context.res.body);
    }).catch(err => {
        console.error('Handler error:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
    });
});

describe('HelloWorld Function', () => {
    // Test 1: Check if the handler returns a 200 status code for a valid request
    it('should return 200 status code when the request is valid', async () => {
        const response = await request(app).get('/?name=World');
        expect(response.statusCode).toBe(200);
    }, 10000);

    // Test 2: Verify the response text
    it('should return "Hello, World!" in the response body', async () => {
        const response = await request(app).get('/?name=World');
        expect(response.text).toBe('Hello, World');
    }, 10000);

    // Test 3: Handle edge case (e.g., non-existent route)
    it('should return 400 for a request without a name', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Please pass a name on the query string or in the request body');
    }, 10000);

    // Test 4: Check if the query parameter is handled correctly
    it('should return the name from query string', async () => {
        const response = await request(app).get('/?name=Shiron');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello, Shiron');
    }, 10000);

    // Test 5: Test missing query parameter
    it('should return 400 if name is missing in query string', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Please pass a name on the query string or in the request body');
    }, 10000);
});