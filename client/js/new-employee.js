const API_EMPLOYEE_URL = 'http://localhost:4000/api/employees';
const API_DESIGNATION_URL = 'http://localhost:4000/api/designations';

window.onload = () => {
  getDesignations();
};

const getDesignations = () => {
  fetch(API_DESIGNATION_URL, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      buildDesignation(data);
    });
};

const buildDesignation = (designations) => {
  let designationContent = '';
  for (designation of designations) {
    const designationId = designation.designation_id;
    const designationName = designation.designation_name;

    designationContent += `
      <option value="${designationId}">${designationName}</option>
    `;

    document.querySelector('#form-employee-designation-id').innerHTML =
      designationContent;
  }
};

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

  console.log(designation_id);
  console.log(employee_name);
  console.log(job_title);
  console.log(salary);
  console.log(email);
  console.log(phone_number);
  console.log(home_address);
  console.log(employee_image);
  let data = new FormData();
  data.append('designation_id', designation_id);
  data.append('employee_name', employee_name);
  data.append('job_title', job_title);
  data.append('salary', salary);
  data.append('email', email);
  data.append('phone_number', phone_number);
  data.append('home_address', home_address);
  data.append('employee_image', employee_image.files[0]);

  fetch(API_EMPLOYEE_URL, {
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
