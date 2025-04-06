module.exports = async function (context, req) {
    const name = req.query.name || (req.body && req.body.name);

    if (!name) {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    } else {
        context.res = {
            status: 200,
            body: `Hello, ${name}`
        };
    }
}; 