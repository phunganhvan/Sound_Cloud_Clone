'use client';
import { Divider, FormControl, Grid, TextField, FormHelperText } from '@mui/material';
import { useId, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
const AuthSignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [helperTextUsername, setHelperTextUsername] = useState('');
    const [helperTextPassword, setHelperTextPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const outlinedPasswordId = useId();
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleSubmit = () => {
        if(username.trim() === '') {
            setHelperTextUsername('Username is required');
        } else {
            setHelperTextUsername('');
        }
        if(password.trim() === '') {
            setHelperTextPassword('Password is required');
        } else {
            setHelperTextPassword('');
        }
        if(username.trim() !== '' && password.trim() !== '') {
            // Handle sign in logic here
            console.log('Signing in with', { username, password });
        }
    }
    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ backgroundColor: '#686c70', borderRadius: '50%', padding: '10px', marginBottom: '8px' }}>
                                <LockIcon color="primary" sx={{ fontSize: 40, padding: '0', color: '#ffffff' }} />
                            </div>
                            <h2 style={{ margin: '0' }}>Sign In</h2>
                        </div>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <TextField
                                id="outlined-basic"
                                label="Username"
                                variant="outlined"
                                sx={{ marginBottom: '16px', width: '100%' }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                error={helperTextUsername !== ''}
                                helperText={helperTextUsername}
                            />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '100%' }} variant="outlined">
                            <InputLabel htmlFor={`${outlinedPasswordId}-input`}>Password</InputLabel>
                            <OutlinedInput
                                id={`${outlinedPasswordId}-input`}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={helperTextPassword !== ''}
                            />
                            <FormHelperText>{helperTextPassword}</FormHelperText>
                        </FormControl>
                        <Button
                            variant="contained"
                            sx={{ marginTop: '16px', width: '100%', marginBottom: '16px' }}
                            onClick={handleSubmit}
                        >
                            Sign In
                        </Button>
                        <Divider>Or using</Divider>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                            <div style={{ backgroundColor: '#bfc807', borderRadius: '50%', padding: '12px', cursor: 'pointer' }}>
                                <GitHubIcon color="primary" sx={{ fontSize: 36, padding: '0', color: '#ffffff' }} />
                            </div>
                            <div style={{ backgroundColor: '#bfc807', borderRadius: '50%', padding: '12px', cursor: 'pointer' }}>
                                <GoogleIcon color="primary" sx={{ fontSize: 36, padding: '0', color: '#ffffff' }} />
                            </div>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
export default AuthSignIn;