export const getTimestampFromObjectId = (objectId) => {
    if (!objectId) return new Date();
    const timestamp = parseInt(objectId.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
};

export const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}s`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
};
