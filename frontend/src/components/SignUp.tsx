import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import type { User } from '../types/user';
import { SIGN_IN, SIGN_UP } from '../mutations/authMutations';
import { useNavigate } from 'react-router-dom';
import type { SignInResponse } from '../types/signinResponse';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [failSignUp, setFailSignUp] = useState(false);
    const [signUp] = useMutation<{ createUser: User }>(SIGN_UP);
    const [signIn] = useMutation<SignInResponse>(SIGN_IN);

    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const signUpInput = { name, email, password };

        // フォーム送信前の検証
        if(!name.trim() || !email.trim() || !password.trim()) {
            setFailSignUp(true);
            return;
        }
        setFailSignUp(false);
        try {
            const result = await signUp({
                variables: { createUserInput: signUpInput }
            })

            if (result.data?.createUser) {
                const signInInput = { email, password };
                const signInResult = await signIn({
                    variables: { signInInput }
                });

                if (signInResult.data) {
                    localStorage.setItem('token', signInResult.data.signIn.accessToken);
                    navigate('/');
                }
            }

        } catch (err) {
            console.error('サインアップエラー：', err);
            alert('ユーザー登録に失敗しました');
            return;

        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            autoComplete="given-name"
                            name="name"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            autoFocus
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                        />

                        {failSignUp && <Typography color='red'>名前またはメールアドレスまたはパスワードが入力されてません。</Typography>}

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid size="auto">
                                <Link href="/signin" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
