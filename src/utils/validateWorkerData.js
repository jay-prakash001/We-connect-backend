export const validateWorkerData = (workerData) => {
    const errors = [];

    // Validate name
    if (!workerData.name) {
        errors.push('Name is required');
    } else if (workerData.name.length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    // Validate bio (optional)
    if (workerData.bio && workerData.bio.length > 300) {
        errors.push('Bio must not exceed 300 characters');
    }

    // Validate profileImg
    if (!workerData.profileImg) {
        errors.push('Profile image is required');
    }

    // Validate location
    if (!workerData.location) {
        errors.push('Location is required');
    } else {
        const { lat, long, city, pin_code, state } = workerData.location;

        if (lat === undefined || lat < -90 || lat > 90) {
            errors.push('Latitude must be between -90 and 90');
        }
        if (long === undefined || long < -180 || long > 180) {
            errors.push('Longitude must be between -180 and 180');
        }
        if (!city) {
            errors.push('City is required');
        } else if (city.length < 2 || city.length > 100) {
            errors.push('City must be between 2 and 100 characters long');
        }
        if (!pin_code || pin_code < 100000 || pin_code > 999999) {
            errors.push('Pin code must be a 6-digit number');
        }
        if (!state) {
            errors.push('State is required');
        } else if (state.length < 2 || state.length > 50) {
            errors.push('State must be between 2 and 50 characters long');
        }
    }

    // Validate phone
    if (!workerData.phone) {
        errors.push('Phone number is required');
    } else if (!/^\d{10}$/.test(workerData.phone.toString())) {
        errors.push('Phone number must be a valid 10-digit number');
    }

    return errors;
};