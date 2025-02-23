import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RegisterView = () => {
  const [registerData, setRegisterData] = useState(null);
  const [error, setError] = useState(null);
  const  params = useParams();
  const hash = params.hash;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://localhost:7268/api/registers/register?hash=${hash}`);
        setRegisterData(response.data.warning);
      } catch (err) {
        setError("Failed to fetch register data.");
      }
    };

    fetchData();
  }, [hash]);

  if (error) return <p>{error}</p>;
  if (!registerData) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Registro</h1>
      <p>{JSON.stringify(registerData, null, 2)}</p>
    </div>
  );
};

export default RegisterView;
