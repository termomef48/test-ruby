import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

const EditPollPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/polls/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setOptions(res.data.options);
      })
      .catch(() => setError('Не удалось загрузить опрос.'));
  }, [id]);

  const handleOptionChange = (idx: number, value: string) => {
    const newOpts = [...options];
    newOpts[idx] = value;
    setOptions(newOpts);
  };
  const addOption = () => setOptions([...options, '']);
  const removeOption = (idx: number) => setOptions(options.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filled = options.map(o => o.trim()).filter(o => o !== '');
    if (!title.trim() || filled.length < 2) {
      setError('Укажите заголовок и минимум две опции.');
      return;
    }
    try {
      await api.patch(`/polls/${id}`, { poll: { title: title.trim(), options: filled } });
      navigate(`/poll/${id}`);
    } catch {
      setError('Не удалось обновить опрос.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Edit Poll</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label><br />
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
                <button type="button" onClick={() => removeOption(idx)}>&times;</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOption}>Add Option</button>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditPollPage;
