const request = require('supertest');
const http = require('http');

// Import your function handler
const handler = require('../HelloWorld/index');

const app = http.createServer((req, res) => {
    handler({ req, res }, {});
});

describe('HelloWorld Function', () => {
    it('should return 200 status code', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

    it('should return "Hello, World!" in the body', async () => {
        const response = await request(app).get('/');
        expect(response.text).toBe('Hello, World!');
    });

    it('should handle an edge case (optional)', async () => {
        const response = await request(app).get('/non-existent');
        // Adjust the expected status or response based on your function logic
        expect(response.statusCode).toBe(200);
    });
});