const API_URL = 'http://localhost:4000/api/employees';

const submitNewEmployee = () => {
  const designation_id = document.getElementById(
    'form-employee-designation-id'
  ).value;
  const employee_name = document.getElementById('form-employee-name').value;
  const job_title = document.getElementById('form-employee-job-title').value;
  const salary = document.getElementById('form-employee-salary').value;
  const email = document.getElementById('form-employee-email').value;
  const phone_number = document.getElementById(
    'form-employee-phone-number'
  ).value;
  const home_address = document.getElementById('form-employee-address').value;
  const employee_image = document.getElementById('form-employee-image');

  let data = new FormData();
  data.append('designation_id', designation_id);
  data.append('employee_name', employee_name);
  data.append('job_title', job_title);
  data.append('salary', salary);
  data.append('email', email);
  data.append('phone_number', phone_number);
  data.append('home_address', home_address);
  data.append('employee_image', employee_image.files[0]);

  fetch(API_URL, {
    method: 'POST',
    body: data,
  }),
    then((response) => {
      console.log('response', response);
      if (response.ok) {
        window.location.href = '/client/index.html';
      } else {
        console.log('Error submitting employee data');
      }
    }).catch((err) => {
      console.log(err);
    });
};
