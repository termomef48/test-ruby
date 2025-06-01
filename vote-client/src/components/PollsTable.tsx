import { Poll } from '../types';
import { Link } from 'react-router-dom';

type Props = {
  polls: Poll[];
};

export default function PollsTable({ polls }: Props) {
  if (!polls.length) {
    return <p>No polls available.</p>;
  }

  return (
    <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Created At</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        {polls.map(poll => {
          // если options нет — считаем по votes
          const optionsCount = Array.isArray(poll.options)
            ? poll.options.length
            : Array.isArray(poll.votes)
              ? [...new Set(poll.votes.map(v => v.option))].length
              : 0;

          return (
            <tr key={poll.id}>
              <td>
                <Link to={`/poll/${poll.id}`}>{poll.title}</Link>
              </td>
              <td>{new Date(poll.created_at).toLocaleString()}</td>
              <td>{optionsCount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

