/* eslint-disable max-len */
export const calculateDistance = (userLat, userLng, vendorLat, vendorLng) => {
    if (vendorLat === null || vendorLng === null) {
        return null;
    }

    const R = 6371; // Earth radius in kilometers
    const dLat = (vendorLat - userLat) * (Math.PI / 180);
    const dLng = (vendorLng - userLng) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * (Math.PI / 180)) * Math.cos(vendorLat * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    distance = Math.round(distance * 100) / 100;
    let unit = "KM";

    if (distance < 1) {
        distance = Math.round(distance * 1000);
        unit = "Meter";
    }

    return `${distance} ${unit}`;
};
