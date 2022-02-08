const callToApi = () => {
  const serverUrl =
    process.env.NODE_ENV === 'production'
      ? 'https://misuperweb.com'
      : 'http://localhost:4000';

  return fetch(`${serverUrl}/tasks`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      return response.result;
    });
};

export default callToApi;
