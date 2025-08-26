
import { User } from '../types/user';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="container">
        <h3>Users</h3>
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="container">
        <h3>Users</h3>
        <div className="empty-state">
          <p>No users found. Create your first user above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h3>Users ({users.length})</h3>
      
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Created:</strong> {formatDate(user.createdAt)}</p>
            <p><strong>Updated:</strong> {formatDate(user.updatedAt)}</p>
            
            <div className="user-actions">
              <button
                className="btn btn-secondary"
                onClick={() => onEdit(user)}
                disabled={loading}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onDelete(user.id)}
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
