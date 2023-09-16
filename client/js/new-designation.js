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

  // let data = new FormData();
  // data.append('designation_name', designation_name);
  // data.append('designation_description', designation_description);

  // for (var pair of data.entries()) {
  //   console.log(pair[0] + ', ' + pair[1]);
  // }

  const data = JSON.stringify({
    designation_name: designation_name,
    designation_description: designation_description,
  });

  fetch(API_URL, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: data,
  })
    .then((response) => {
      console.log('response', response);
      if (response.ok) {
        window.location.href = '/client/designation.html';
      } else {
        console.log('Error submitting designation data');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
