import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const apiUrl = process.env.REACT_APP_API_BASE_URL;
function ScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    date: '',
    timeEntry: '',
    departureTime: ''
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/schedules`);
        setSchedules(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching schedules', error);
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Manejar el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  // Crear un nuevo horario
  const handleCreateSchedule = async () => {
    try {
      await axios.post(`${apiUrl}/api/schedules/create`, newSchedule);

      const response = await axios.get(`${apiUrl}/api/schedules`);

      if (response.status === 200) {
        setSchedules(response.data);
        setShowModal(false);
        setNewSchedule({
          date: '',
          timeEntry: '',
          departureTime: ''
        });
      }
    } catch (error) {
      console.error('Error creating schedule', error);
      alert('Error creando el horario');
    }
  };

  if (loading) {
    return <p>Cargando horarios...</p>;
  }

  return (
    <div className="container">
      <h2 className="my-4">Lista de Horarios</h2>
      <button className="btn btn-success mb-4" onClick={() => setShowModal(true)}>
        Crear Nuevo Horario
      </button>
      {/* Modal para crear un nuevo horario */}
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Horario</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="date">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={newSchedule.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="timeEntry">Hora de Entrada</label>
                    <input
                      type="time"
                      className="form-control"
                      id="timeEntry"
                      name="timeEntry"
                      value={newSchedule.timeEntry}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="departureTime">Hora de Salida</label>
                    <input
                      type="time"
                      className="form-control"
                      id="departureTime"
                      name="departureTime"
                      value={newSchedule.departureTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateSchedule}>
                  Crear Horario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Hora de Entrada</th>
            <th>Hora de Salida</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td>{schedule.id}</td>
              <td>{schedule.date}</td>
              <td>{schedule.timeEntry}</td>
              <td>{schedule.departureTime}</td>
              <td>
                <Link to={`/view/${schedule.id}`} className="btn btn-info btn-sm">
                  Ver Detalles
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleList;
