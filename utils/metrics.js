const logger = require('./logger');

/**
 * Track application metrics
 * @param {string} metric - Name of the metric to track
 * @param {number} value - Value to record
 * @param {Object} [tags] - Optional tags for the metric
 */
const trackMetrics = (metric, value, tags = {}) => {
    try {
        // Log metric for now, can be extended to use actual metrics service
        logger.info('Metric tracked:', {
            metric,
            value,
            tags,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Error tracking metric:', error);
    }
};

module.exports = {
    trackMetrics
};