import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const RegisterList = () => {
  const [registers, setRegisters] = useState([]);
  const [selectedRegister, setSelectedRegister] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  // Fetch all registers on component mount
  useEffect(() => {
    fetchRegisters();
  }, []);

  const fetchRegisters = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/registers`);
      console.log(response.data); //{register.employee.employeeSchedules.schedule.timeEntry}-{register.employee.employeeSchedules.schedule.departureTime}
      
      setRegisters(response.data);
    } catch (error) {
      console.error('Error fetching registers', error);
    }
  };

  const fetchRegisterById = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/api/registers/${id}`);
      setSelectedRegister(response.data);
    } catch (error) {
      console.error(`Error fetching register with ID ${id}`, error);
    }
  };

  const updateRegister = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/registers/${id}`, updatedData);
      fetchRegisters();  // Refresh the list after update
      setSelectedRegister(null);
      alert('Register updated successfully!');
    } catch (error) {
      console.error('Error updating register', error);
    }
  };

  const deleteRegister = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/registers/${id}`);
      fetchRegisters();  // Refresh the list after delete
      alert('Register deleted successfully!');
    } catch (error) {
      console.error(`Error deleting register with ID ${id}`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false 
    });
  };
  
  const formatHours = (hours) => {
    return `${hours} horas`;
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Lista de Registros</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Pago x Hora</th>
            <th>Horario</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Horas trabajadas</th>
            <th>Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registers.map(register => (
            <tr key={register.id}>
              <td>{register.employee.name}</td>
              <td>{formatCurrency(register.employee.hourlyWage)}</td>
              <td>{register.employee?.employeeSchedules?.length > 0 ? (
                    register.employee.employeeSchedules
                      .filter(employeeSchedule => employeeSchedule.schedule?.date === register.date) // Filtra los horarios que coinciden con la fecha
                      .map((employeeSchedule, index) => (
                        employeeSchedule.schedule ? (
                          <div key={index}>{formatDate(employeeSchedule.schedule.date)}-{employeeSchedule.schedule.timeEntry}-{employeeSchedule.schedule.departureTime}</div>
                        ) : (
                          <div key={index}>No hay horario disponible.</div>
                        )
                      ))
                    ) : (
                      <div>No hay horarios asignados.</div>
                     )}
              </td>
              <td>{formatDateTime(register.checkInTime)}</td>
              <td>{register.checkOutTime ? formatDateTime(register.checkOutTime) : ''}</td>
              <td>{formatHours(register.hoursWorked)}</td>
              <td>{formatCurrency(register.salary)}</td>
              <td>
                <button className="btn btn-info mr-2" onClick={() => fetchRegisterById(register.id)}>Ver</button>
                <button className="btn btn-danger" onClick={() => deleteRegister(register.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedRegister && (
        <div className="mt-5">
          <h2>Edit Register</h2>
          <div className="form-group">
            <label>ID:</label>
            <input
              type="text"
              className="form-control"
              value={selectedRegister.id}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              defaultValue={selectedRegister.name}
              onChange={handleInputChange}
            />
          </div>
          <button className="btn btn-primary" onClick={() => updateRegister(selectedRegister.id)}>
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterList;
