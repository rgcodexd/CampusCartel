export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateCollegeEmail = (email: string): boolean => {
  if (!validateEmail(email)) {
    return false;
  }
  
  // List of common college email domains - extend as needed
  const collegeDomains = [
    '.edu',
    '.ac.',
    'university',
    'college',
    'institute'
  ];
  
  const emailLower = email.toLowerCase();
  return collegeDomains.some(domain => emailLower.indexOf(domain) !== -1);
};

export const validateStudentId = (studentId: string): boolean => {
  if (!studentId || typeof studentId !== 'string') {
    return false;
  }
  // Basic validation - should be alphanumeric and at least 6 characters
  const studentIdRegex = /^[A-Za-z0-9]{6,}$/;
  return studentIdRegex.test(studentId.trim());
};

export const validatePrice = (price: string | number): boolean => {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(priceNum) && priceNum > 0 && priceNum <= 10000;
};

export const validateRequired = (value: string): boolean => {
  return Boolean(value && typeof value === 'string' && value.trim().length > 0);
};

export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  // Basic phone validation - allows various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone);
};

export const validateImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const validateProductTitle = (title: string): boolean => {
  if (!validateRequired(title)) {
    return false;
  }
  return title.length >= 3 && title.length <= 100;
};

export const validateProductDescription = (description: string): boolean => {
  if (!validateRequired(description)) {
    return false;
  }
  return description.length >= 10 && description.length <= 1000;
};

export const validateTags = (tags: string[]): boolean => {
  if (!Array.isArray(tags)) {
    return false;
  }
  return tags.every(tag => typeof tag === 'string' && tag.trim().length > 0 && tag.length <= 50);
};

export const validateLocation = (location: { latitude: number; longitude: number; address: string }): boolean => {
  if (!location || typeof location !== 'object') {
    return false;
  }
  
  const { latitude, longitude, address } = location;
  
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return false;
  }
  
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return false;
  }
  
  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    return false;
  }
  
  return true;
};