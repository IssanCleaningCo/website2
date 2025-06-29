exports.handler = async function(event, context) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'API is working!',
            method: event.httpMethod,
            path: event.path
        })
    };
}; 