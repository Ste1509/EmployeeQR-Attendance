import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {QRCodeSVG} from 'qrcode.react';


const apiUrl = process.env.REACT_APP_API_BASE_URL;
const EmployeeDetail = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [qrCode, setQRCode] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');

  // Obtener datos del empleado
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeResponse = await axios.get(`${apiUrl}/api/employees/${employeeId}`);
        setEmployee(employeeResponse.data);

        // Obtener el código QR
        const qrResponse = await axios.get(`${apiUrl}/api/qrcodes/${employeeId}`);

        if (qrResponse.data && qrResponse.data.code) {
          setQRCode(qrResponse.data.code);
        } else {
          setQRCode(null);  // Si no hay QR, limpia el valor anterior
        }

        // Obtener los horarios
        const scheduleResponse = await axios.get(`${apiUrl}/api/schedules/available-schedules?employeeId=${employeeId}`);
        
        setSchedules(scheduleResponse.data);

      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  // Asignar horario
  const handleAssignSchedule = async () => {
    try {
      await axios.post(`/api/schedules/assign`, {
        employeeId,
        scheduleId: selectedSchedule
      });
      alert('Horario asignado correctamente');
    } catch (error) {
      console.error('Error assigning schedule:', error);
    }
  };

    // Generar código QR
    const handleGenerateQRCode = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/qrcodes/generate?employeeId=${employee.id}`);        
        if (response.data && response.data.code) {
          setQRCode(response.data.code);

        } else {
          alert('Error generando el código QR');
        }
      } catch (error) {
        console.error('Error generating QR code:', error);
        alert('Error generando el código QR');
      }
    };

  // Descargar código QR
  const handleDownloadQRCode = () => {
    const svg = document.getElementById('qrcode');

    // Verifica si el SVG existe
    if (!svg) {
        console.error('Elemento SVG no encontrado');
        return;
    }

    // Serializa el SVG a una cadena
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Crea un Blob a partir de la cadena SVG
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Crea un elemento de enlace para descargar el archivo
    let downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'qrcode.svg'; // Cambia la extensión a .png si necesitas convertirlo más adelante
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Libera el objeto URL
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container my-4">
      {employee ? (
        <div>
          <h2 className="mb-4">Detalles del Empleado</h2>
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>Nombre:</strong> {employee.name}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Salario por Hora:</strong> {employee.hourlyWage}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">  
              <p><strong>Email:</strong> {employee.email}</p>
            </div>  
          </div>
          <h4 className="mt-4">Asignar Horario</h4>
          <div className="form-group">
            <label htmlFor="scheduleSelect">Seleccionar Horario:</label>
            <select
              className="form-control mb-3"
              id="scheduleSelect"
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
            >
              <option value="">Seleccionar un horario</option>
              {schedules.map((schedule) => (
                <option key={schedule.id} value={schedule.id}>
                  {schedule.timeEntry} - {schedule.departureTime} - {schedule.date}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleAssignSchedule}>Asignar Horario</button>
          </div>

          <h4 className="mt-4">Código QR</h4>
          {qrCode ? (
            <div className="text-center">
              <QRCodeSVG id="qrcode" value={qrCode} size={256} level="L"/>
              <br />
              <button className="btn btn-secondary mt-3" onClick={handleDownloadQRCode}>Descargar Código QR</button>
              
            </div>
          ) : (
            <div>
              <p>No hay código QR generado</p>
              <button className="btn btn-primary mt-3" onClick={handleGenerateQRCode}>Generar Código QR</button>
            </div>
          )}
        </div>
      ) : (
        <p>Cargando detalles del empleado...</p>
      )}
    </div>
  );
};

export default EmployeeDetail;
