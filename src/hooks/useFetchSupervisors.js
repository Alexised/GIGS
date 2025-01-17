import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}users/role?id=3`);
        setSupervisors(response.data);
      } catch (error) {
        setError(error);
        console.error('Error fetching supervisors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  return { supervisors, loading, error };
};

export default useFetchSupervisors;
