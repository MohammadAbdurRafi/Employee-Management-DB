const API_URL = 'http://localhost:4000/api/designations';

const submitNewDesignation = () => {
  const designation_name = document.getElementById(
    'form-designation-name'
  ).value;
  const designation_description = document.getElementById(
    'form-designation-description'
  ).value;

  console.log(designation_name);
  console.log(designation_description);

  let data = new FormData();
  data.append('designation_name', designation_name);
  data.append('designation_description', designation_description);

  console.log(data);

  fetch(API_URL, {
    method: 'POST',
    body: data,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
