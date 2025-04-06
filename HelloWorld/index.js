// HelloWorld/index.js

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    if (name) {
        context.res = {
            status: 200,
            body: "Hello, " + name
        };
    } else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};