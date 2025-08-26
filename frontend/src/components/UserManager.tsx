import { useState, useEffect } from 'react';
import { UserForm } from './UserForm';
import { UserList } from './UserList';
import { User, CreateUser } from '../types/user';
import { userApi } from '../services/userApi';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<O.Option<User>>(O.none);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await userApi.getAllUsers();
      if (E.isRight(result)) {
        setUsers(result.right);
      } else {
        setError(result.left);
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: CreateUser) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await userApi.createUser(userData);
      if (E.isRight(result)) {
        setUsers(prev => [...prev, result.right]);
        setSuccess('User created successfully!');
      } else {
        setError(result.left);
      }
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: number, userData: Partial<CreateUser>) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await userApi.updateUser(id, userData);
      if (E.isRight(result)) {
        setUsers(prev => prev.map(user => 
          user.id === id ? result.right : user
        ));
        setEditingUser(O.none);
        setSuccess('User updated successfully!');
      } else {
        setError(result.left);
      }
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await userApi.deleteUser(id);
      if (E.isRight(result)) {
        setUsers(prev => prev.filter(user => user.id !== id));
        setSuccess('User deleted successfully!');
      } else {
        setError(result.left);
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(O.some(user));
  };

  const cancelEditing = () => {
    setEditingUser(O.none);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    const timer = setTimeout(clearMessages, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <div className="container">
      <h2>User Management</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <UserForm 
        onSubmit={handleCreateUser}
        loading={loading}
      />
      
      {O.isSome(editingUser) && (
        <div className="container">
          <h3>Edit User</h3>
          <UserForm 
            onSubmit={(data) => handleUpdateUser(editingUser.value.id, data)}
            initialData={editingUser.value}
            loading={loading}
            onCancel={cancelEditing}
            isEditing
          />
        </div>
      )}
      
      <UserList 
        users={users}
        onEdit={startEditing}
        onDelete={handleDeleteUser}
        loading={loading}
      />
    </div>
  );
};
