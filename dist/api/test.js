exports.handler = async function(event, context) {
    try {
        // Test if we can require resend
        let resendStatus = 'Not tested';
        try {
            const { Resend } = require('resend');
            resendStatus = 'Resend module loaded successfully';
        } catch (resendError) {
            resendStatus = `Resend module failed: ${resendError.message}`;
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'API is working!',
                method: event.httpMethod,
                path: event.path,
                resendStatus: resendStatus,
                environment: process.env.NODE_ENV || 'development'
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Function crashed',
                message: error.message,
                stack: error.stack
            })
        };
    }
}; 