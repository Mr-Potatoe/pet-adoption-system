import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { User, UserRole } from '@/types'; // Assuming types are in a separate file

interface UserDialogProps {
    open: boolean;
    selectedUser: User | null;
    newUser: Omit<User, 'user_id'>; // Keep password_hash here
    onClose: () => void;
    onSave: (newUser: Omit<User, 'user_id'>) => void;
    onChange: (field: keyof Omit<User, 'user_id'>, value: string) => void;
}


const UserDialog: React.FC<UserDialogProps> = ({ open, selectedUser, newUser, onClose, onSave, onChange }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Create User'}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={newUser.username}
                    onChange={(e) => onChange('username', e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={newUser.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Profile Picture URL"
                    variant="outlined"
                    fullWidth
                    value={newUser.profile_picture || ''}
                    onChange={(e) => onChange('profile_picture', e.target.value || '')}
                    sx={{ marginBottom: 2 }}
                />
                <TextField
                    label="Role"
                    variant="outlined"
                    fullWidth
                    select
                    value={newUser.role}
                    onChange={(e) => onChange('role', e.target.value as UserRole)}
                    sx={{ marginBottom: 2 }}
                    SelectProps={{
                        native: true,
                    }}
                >
                    <option value="admin">Admin</option>
                    <option value="adopter">Adopter</option>
                </TextField>
                {/* Password Field */}
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={newUser.password_hash || ''}  // Correct field name here
                    onChange={(e) => onChange('password_hash', e.target.value)}  // Correct field name here
                    sx={{ marginBottom: 2 }}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={() => onSave(newUser)} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDialog;
