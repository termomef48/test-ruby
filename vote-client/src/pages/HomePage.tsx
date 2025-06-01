import { useEffect, useState } from 'react';
import { api } from '../api';
import { Poll } from '../types';
import PollsTable from '../components/PollsTable';

const HomePage = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    api.get<Poll[]>('/polls').then(res => setPolls(res.data));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>All Polls</h1>
      <PollsTable polls={polls} />
    </div>
  );
};

export default HomePage;
