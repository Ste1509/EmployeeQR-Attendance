import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Modal} from 'react-bootstrap';
import EmployeeDetail from './EmployeeDetail';


const apiUrl = process.env.REACT_APP_API_BASE_URL;

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', hourlyWage: '', email: '' });


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/employees`, newEmployee);
      // Actualiza la lista de empleados después de crear uno nuevo
      const response = await axios.get(`${apiUrl}/api/employees`);
      setEmployees(response.data);
      // Limpiar el formulario y cerrar el modal
      setNewEmployee({ name: '', hourlyWage: '', email: '' });
      handleClose();
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Lista de Empleados</h2>
      <button className="btn btn-success mb-4" variant="primary" onClick={handleShow}>
        Crear Nuevo Empleado
      </button>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>
                <button className="btn btn-primary" onClick={() => setSelectedEmployeeId(employee.id)}>
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

            {/* Modal para crear un nuevo empleado */}
      <Modal show={showModal} onHide={handleClose}>
        <div className="modal-header">
          <h5 className="modal-title">Crear Nuevo Empleado</h5>
          <button type="button" className="close" onClick={handleClose}>
            <span>&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="formName">Nombre</label>
              <input
                type="text"
                className="form-control"
                id="formName"
                placeholder="Ingrese el nombre"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="formHourlyWage">Salario por Hora</label>
              <input
                type="number"
                className="form-control"
                id="formHourlyWage"
                placeholder="Ingrese el salario por hora"
                name="hourlyWage"
                value={newEmployee.hourlyWage}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="formEmail">Email</label>
              <input
                type="email"
                className="form-control"
                id="formEmail"
                placeholder="Ingrese el email"
                name="email"
                value={newEmployee.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Crear Empleado
            </button>
          </form>
        </div>
      </Modal>
          
      {selectedEmployeeId && <EmployeeDetail employeeId={selectedEmployeeId} />}
    </div>
  );
};

export default EmployeeList;
