/**
 * License Status Utility
 * Calculates license status based on MCMC expiry date
 */

/**
 * Get license status based on expiry date
 * @param {string} expiryDateString - Date in format "DD/MM/YYYY" or "YYYY-MM-DD"
 * @returns {Object} Status object with label, color, bg, and icon
 */
export const getLicenseStatus = (expiryDateString) => {
    if (!expiryDateString) {
        return null; // No expiry data available
    }

    let expiryDate;

    // Parse date - handle both DD/MM/YYYY and YYYY-MM-DD formats
    if (expiryDateString.includes('/')) {
        const [day, month, year] = expiryDateString.split('/');
        expiryDate = new Date(year, month - 1, day);
    } else {
        expiryDate = new Date(expiryDateString);
    }

    // Check if date is valid
    if (isNaN(expiryDate.getTime())) {
        return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
        // Expired
        return {
            status: 'expired',
            label: 'Expired',
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.2)',
            icon: '❌',
            daysUntilExpiry
        };
    } else if (daysUntilExpiry <= 90) {
        // Expiring soon (within 90 days)
        return {
            status: 'expiring',
            label: 'Expiring Soon',
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.2)',
            icon: '⚠️',
            daysUntilExpiry
        };
    } else {
        // Active (more than 90 days)
        return {
            status: 'active',
            label: 'Active',
            color: '#22c55e',
            bg: 'rgba(34, 197, 94, 0.2)',
            icon: '✅',
            daysUntilExpiry
        };
    }
};

/**
 * Format expiry date for display
 * @param {string} expiryDateString - Date string
 * @returns {string} Formatted date string
 */
export const formatExpiryDate = (expiryDateString) => {
    if (!expiryDateString) return '';

    let date;
    if (expiryDateString.includes('/')) {
        const [day, month, year] = expiryDateString.split('/');
        date = new Date(year, month - 1, day);
    } else {
        date = new Date(expiryDateString);
    }

    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
