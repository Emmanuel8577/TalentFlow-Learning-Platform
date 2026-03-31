const Notification = require('../models/notification.model');

exports.getUserNotifications = async (req, res) => {
    try {
        // req.user.id comes from the 'protect' middleware your partner wrote
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: notifications
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.update(
            { isRead: true },
            { where: { id: req.params.id, userId: req.user.id } }
        );

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: null
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};