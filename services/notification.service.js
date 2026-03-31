const Notification = require('../models/notification.model');

/**
 * Helper to create a notification for any user
 * @param {number} userId - The ID of the user receiving the alert
 * @param {string} title - Short heading
 * @param {string} message - The full notification text
 * @param {string} type - Category (assignment, enrollment, etc.)
 */
const createNotification = async (userId, title, message, type = 'system') => {
    try {
        await Notification.create({ userId, title, message, type });
        console.log(`Notification sent to User ${userId}`);
    } catch (error) {
        console.error("Error creating notification:", error.message);
    }
};

module.exports = { createNotification };