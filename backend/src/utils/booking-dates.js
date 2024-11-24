const formatBookingDates = ({ start, end }) => {
    return {
        startDate: new Date(start + 'T15:00:00'),
        endDate: new Date(end + 'T11:00:00')
    }
}

const hasNoBookingOverlap = (pastBookings, startDate, endDate) => {
    return pastBookings.every(b => {
        const endOverlap = b.endDate > startDate;
        const startOverlap = b.startDate < endDate;
        return !(endOverlap && startOverlap);
    });
}

const validateBookingDates = (startDate, endDate) => {
    return startDate < endDate;
}

module.exports = {
    formatBookingDates,
    hasNoBookingOverlap, 
    validateBookingDates
}