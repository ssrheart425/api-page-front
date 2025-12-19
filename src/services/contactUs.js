import axios from 'axios'

export async function fetchContactUsLink({ channel } = {}) {
  const configuredUrl = import.meta.env.VITE_CONTACT_US_URL
  if (configuredUrl) return configuredUrl

  // TODO: Implement your backend API request here and return a URL string.
  // Example:
  // const { data } = await axios.get('/api/contact-us', { params: { channel } })
  // return data?.url
  void axios
  void channel

  throw new Error('Contact Us API not implemented. Please edit src/services/contactUs.js.')
}

