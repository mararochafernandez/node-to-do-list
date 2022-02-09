const serverUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://misuperweb.com'
    : 'http://localhost:4000';

const getTasksFromApi = () => {
  return fetch(`${serverUrl}/tasks`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      return response.result;
    });
};

const sendTaskToApi = (data) => {
  console.log(data);
  return fetch(`${serverUrl}/task`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      return response.result;
    });
};

const objToExport = {
  getTasksFromApi: getTasksFromApi,
  sendTaskToApi: sendTaskToApi,
};

export default objToExport;
