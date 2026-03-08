export const contactUs = async (payload) => {
  const res = await fetch(`https://sdlserver.hyplap.com/api/enquiryform`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log(data);

  if (!data.success) {
    throw new Error(data.message || 'Failed to submit enquiry.');
  }

  return data;
};