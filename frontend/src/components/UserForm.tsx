import { useState, useEffect } from 'react';
import { CreateUser, User } from '../types/user';
import * as E from 'fp-ts/Either';
import { CreateUserCodec } from '../types/user';

interface UserFormProps {
  onSubmit: (data: CreateUser) => void;
  loading?: boolean;
  initialData?: User;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  loading = false,
  initialData,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<CreateUser>({
    email: '',
    name: '',
  });
  const [errors, setErrors] = useState<Partial<CreateUser>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        name: initialData.name,
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUser> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Validate with fp-ts before submitting
    const validationResult = CreateUserCodec.decode(formData);
    
    if (E.isLeft(validationResult)) {
      setErrors({ email: 'Invalid form data' });
      return;
    }

    onSubmit(validationResult.right);
    
    if (!isEditing) {
      setFormData({ email: '', name: '' });
    }
  };

  const handleInputChange = (field: keyof CreateUser, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <h3>{isEditing ? 'Edit User' : 'Create New User'}</h3>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter email address"
          disabled={loading}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter full name"
          disabled={loading}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
        </button>
        
        {isEditing && onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
