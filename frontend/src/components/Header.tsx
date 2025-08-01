import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('ログアウトしますか？')) {
            try {
                localStorage.removeItem('token');
                navigate('/signin');
            } catch (error) {
                console.error('ログアウト処理中にエラーが発生しました:', error);
                // エラーが発生してもサイインページに遷移
                navigate('/signin');
            }
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        GraphQL Tasks
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
