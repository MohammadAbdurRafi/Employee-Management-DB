const API_BASE_URL = 'http://localhost:4000';
const API_URL = 'http://localhost:4000/api/employees';

window.onload = () => {
  getEmployees();
};

const getEmployees = () => {
  fetch(API_URL, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      buildEmployee(data);
    });
};

const buildEmployee = (employees) => {
  let employeeContent = '';
  for (employee of employees) {
    const dateCreated = new Date(employee.date_created).toDateString();
    const employeeImage =
      employee.employee_image !== undefined
        ? `${API_BASE_URL}/${employee.employee_image}`
        : '/client/assets/default-employee-image.jpg';
    const employeeLink = `/client/employee.html?id=${employee.employee_id}`;

    employeeContent += `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-4">
                    <img src="${employeeImage}" class="card-img-top">
                </div>
                <div class="col-8">
                        <div class="card-body">
                            <h5 class="card-title">${employee.employee_name}</h5>
                            <p class="card-text">Employed on ${dateCreated}</p>
                            <p class="card-text">Job Title: ${employee.job_title}</p>
                            <p class="card-text">Phone Number: ${employee.phone_number}</p>
                            <a href="${employeeLink}" class="btn btn-primary">More Details</a>
                        </div>
                    </div>
            </div>
        </div>
    `;
  }
  document.querySelector('#employees').innerHTML = employeeContent;
};
