import axios from 'axios';

export const apiGetRequest = route => {
  return new Promise((resolve, reject) => {
    axios
      .get(route)
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};
