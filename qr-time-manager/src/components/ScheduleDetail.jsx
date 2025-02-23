import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_BASE_URL;
function ScheduleDetails() {
  const [schedule, setSchedule] = useState(null);
  const [employees, setEmployees] = useState([]); // Lista de empleados disponibles
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const params  = useParams();
  const scheduleId  = params.id;


  const openModal = (message) => {
    console.log("MESSAGE: ", message);
    
    setModalMessage(message);
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
    setModalMessage('');
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/schedules/${scheduleId}`);    
        setSchedule(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedule details', error);
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/employees`); // Supongo que esta es la ruta
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees', error);
      }
    };

    fetchEmployees();
  }, []);

  // Asignar empleados al horario
  const addEmployeesToSchedule = async () => {
    if (selectedEmployees.length > 0) {
      try {
        const result = await axios.post(`${apiUrl}/api/schedules/${scheduleId}/employees`, selectedEmployees);
        openModal(result.data); 
        const response = await axios.get(`${apiUrl}/api/schedules/${scheduleId}`);   
        setSchedule(response.data); 
        setSelectedEmployees([]);
        
      } catch (error) {
        console.error('Error adding employees to schedule', error.response.data);
      }
    }
  };

    // Manejar la selección de múltiples empleados
    const handleEmployeeSelect = (e) => {
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selected.push(parseInt(options[i].value)); // Convertir el valor a número
        }
      }
      setSelectedEmployees(selected);
    };

  // Eliminar empleado del horario
  const removeEmployeeFromSchedule = async (employeeId) => {
    try {
      await axios.delete(`${apiUrl}/api/schedules/${scheduleId}/employees/${employeeId}`);
      const response = await axios.get(`${apiUrl}/api/schedules/${scheduleId}`); 
      setSchedule(response.data); // Actualiza la lista de empleados en el horario
    } catch (error) {
      console.error('Error removing employee from schedule', error);
    }
  };

  if (loading) {
    return <p>Cargando detalles del horario...</p>;
  }

  if (!schedule) {
    return <p>No se encontraron detalles del horario.</p>;
  }

  const formattedDate = new Date(schedule.date).toLocaleDateString();

  return (
    <div className="container mt-4">
      <h2>Detalles del Horario</h2>
      <p>Fecha: {formattedDate}</p>
      <p>Hora de Entrada: {schedule.timeEntry}</p>
      <p>Hora de Salida: {schedule.departureTime}</p>

      <h3>Empleados Asignados</h3>

      {schedule.employeeSchedules && schedule.employeeSchedules.length > 0 ? (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {schedule.employeeSchedules.map((empSch) => (
            <tr key={empSch.employee.id}>
              <td>{empSch.employee.name}</td>
              <td>
              <button
                onClick={() => removeEmployeeFromSchedule(empSch.employee.id)}
                className="btn btn-danger btn-sm"
              >
                Eliminar
              </button></td>
            </tr>
          ))}
        </tbody>
        </table>
        </div>
      ) : (
        <p>No hay empleados asignados a este horario.</p>
      )}
      <h3>Agregar Empleado al Horario</h3>
      <div className="form-group">
        <label htmlFor="employeeSelect">Selecciona un empleado:</label>
        <select
          id="employeeSelect"
          multiple 
          value={selectedEmployees}
          onChange={handleEmployeeSelect}
          className="form-control"
        >
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={addEmployeesToSchedule} className="btn btn-primary mt-2">
        Agregar Empleado
      </button>
            {/* Modal personalizado utilizando Bootstrap */}
      {modalOpen && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>{modalMessage}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleDetails;
