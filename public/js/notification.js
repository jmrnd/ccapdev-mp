function markAsRead (notifId) {
    markNotificationAsRead(notifId)
}

const markNotificationAsRead = async (notifId) => {
    try {
        const response = await fetch(`/mark-notification-read/${notifId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("NOTIF READ OK.");
            
        } else {
            console.error('Failed to mark notification as read.');
        }

    } catch (err) {
        console.error("Error marking notification as read.");
    }
}