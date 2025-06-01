import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { cable } from '../cable';
import { Poll, Vote } from '../types';

const PollPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get<Poll>(`/polls/${id}`)
      .then(res => setPoll(res.data))
      .catch(() => {
        setError('Poll not found, redirecting to list…');
        setTimeout(() => navigate('/'), 1500);
      });
  }, [id]);

  useEffect(() => {
    if (!poll) return;
    const sub = cable.subscriptions.create(
      { channel: 'PollChannel', poll_id: poll.id },
      {
        received: (vote: Vote) => {
          setPoll(prev =>
            prev
              ? { ...prev, votes: [...(prev.votes || []), vote] }
              : prev
          );
        }
      }
    );
    return () => sub.unsubscribe();
  }, [poll]);

  if (error) return <p>{error}</p>;
  if (!poll) return <p>Loading poll…</p>;

  const votesList = Array.isArray(poll.votes) ? poll.votes : [];
  const optionsList: string[] = Array.isArray((poll as any).options)
    ? (poll as any).options
    : Array.from(new Set(votesList.map(v => v.option)));

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{poll.title}</h1>
      <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Option</th>
            <th>Votes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {optionsList.map(opt => {
            const count = votesList.filter(v => v.option === opt).length;
            return (
              <tr key={opt}>
                <td>{opt}</td>
                <td>{count}</td>
                <td>
                  <button
                    onClick={() =>
                      api.post('/votes', { vote: { poll_id: poll.id, option: opt } })
                    }
                  >
                    Vote
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}; 

export default PollPage;  
