/**
 * Asyc Error Handler that takes in an async function as parameter
 * @param {Asyncroneous} fn
 */
module.exports = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
