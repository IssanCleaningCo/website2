module.exports = async function(event, context) {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Simple API is working!',
            method: event.httpMethod,
            path: event.path,
            timestamp: new Date().toISOString()
        })
    };
}; 