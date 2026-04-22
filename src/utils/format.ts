export const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  
  // Remove all non-digits
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;
  
  // Handle empty or small input
  if (phoneNumberLength === 0) return "";
  if (phoneNumberLength <= 3) return phoneNumber;
  
  // Format based on length
  if (phoneNumberLength <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  
  // Cap at 10 digits
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};
