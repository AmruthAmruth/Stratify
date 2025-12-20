/**
 * Format a date/time for display in chat list
 * Returns: "Just now", "5m ago", "Today", "Yesterday", or "DD/MM/YYYY"
 */
export function formatChatTime(date: Date | string | undefined): string {
    if (!date) return "";

    const messageDate = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    // Less than 1 minute
    if (diffMins < 1) return "Just now";

    // Less than 1 hour
    if (diffMins < 60) return `${diffMins}m ago`;

    // Less than 24 hours (today)
    if (diffHours < 24 && messageDate.getDate() === now.getDate()) {
        return messageDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.getDate() === yesterday.getDate() &&
        messageDate.getMonth() === yesterday.getMonth() &&
        messageDate.getFullYear() === yesterday.getFullYear()) {
        return "Yesterday";
    }

    // Older - show date
    return messageDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

/**
 * Format timestamp for message bubbles
 * Returns: "HH:MM AM/PM"
 */
export function formatMessageTime(date: Date | string): string {
    const messageDate = typeof date === "string" ? new Date(date) : date;
    return messageDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
