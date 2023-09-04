const API_BASE_URL = 'http://localhost:4000/';
const API_URL = 'http://localhost:4000/api/designations/';

window.onload = () => {
  getDesignations();
};

const getDesignations = () => {
  fetch(API_URL, {
    method: 'GET',
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      buildDesignation(data);
    });
};

const buildDesignation = (designations) => {
  let designationContent = '';
  for (designation of designations) {
    designationContent += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${designation.designation_name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Designation ID: ${designation.designation_id}</h6>
          <p class="card-text">Description: ${designation.designation_description}</p>
        </div>
        
      </div>
    `;
    document.querySelector('#designations').innerHTML = designationContent;
  }
};
