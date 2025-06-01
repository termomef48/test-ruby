import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const NewPollPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);  
  const [error, setError] = useState<string | null>(null);

  const handleOptionChange = (idx: number, value: string) => {
    const newOpts = [...options];
    newOpts[idx] = value;
    setOptions(newOpts);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (idx: number) =>
    setOptions(options.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filled = options.filter(o => o.trim() !== '');
    if (!title.trim() || filled.length < 2) {
      setError('Please enter a title and at least two options.');
      return;
    }
    try {
      const res = await api.post('/polls', {
        poll: { title: title.trim(), options: filled }
      });

      navigate(`/poll/${res.data.id}`);
    } catch (e: any) {
      setError('Failed to create poll.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>New Poll</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br/>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
          />
        </div>

        <div>
          <label>Options:</label>
          {options.map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={opt}
                onChange={e => handleOptionChange(idx, e.target.value)}
                style={{ flex: 1 }}
              />
              {options.length > 2 && (
                <button type="button" onClick={() => removeOption(idx)}>
                  &times;
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption}>Add Option</button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Create Poll</button>
        </div>
      </form>
    </div>
  );
};

export default NewPollPage;
