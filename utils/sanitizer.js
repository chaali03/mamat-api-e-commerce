const sanitizeData = (data) => {
    if (typeof data !== 'object' || !data) {
      return data;
    }
  
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Remove HTML tags except for allowed fields
        if (!['description', 'content'].includes(key)) {
          sanitized[key] = value.replace(/<[^>]*>?/gm, '');
        } else {
          sanitized[key] = value;
        }
        
        // Trim whitespace
        sanitized[key] = sanitized[key].trim();
        
        // Convert special characters to HTML entities
        sanitized[key] = sanitized[key]
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => sanitizeData(item));
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
  
    return sanitized;
  };
  
  module.exports = {
    sanitizeData
  };