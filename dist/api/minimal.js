module.exports = (req, res) => {
    res.json({
        message: 'Minimal function works!',
        method: req.method,
        url: req.url
    });
}; 