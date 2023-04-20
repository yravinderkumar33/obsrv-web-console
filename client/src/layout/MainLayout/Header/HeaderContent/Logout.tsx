import { useTheme } from '@mui/material/styles';
import { Box, Avatar, Tooltip } from '@mui/material';
import IconButton from 'components/@extended/IconButton';
import { useMemo } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { http } from './../../../../services/http'
import { dispatch } from 'store';
import { error } from 'services/toaster';
import { useNavigate } from 'react-router';

const Logout = () => {

    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            await http.get("/api/oauth/logout")
            navigate("/login")
        } catch (err) {
            dispatch(error({ message: "Unable to logout!" }));
        }
    }

    const buttons = useMemo(() => [
        {
            icon: LogoutOutlined,
            tooltip: 'Logout'
        }
    ], []);

    return (
        <Box sx={{ flexShrink: 0, ml: 0.75 }}>
            {
                buttons.map((button, index) => {
                    return <Tooltip title={button.tooltip} key={index}>
                        <IconButton color="secondary" variant="light" sx={{ color: 'text.primary', bgcolor: 'transparent', ml: 0.75 }} onClick={_ => handleClick()}>
                            <Avatar sx={{ width: 30, height: 30 }}>
                                <LogoutOutlined/>
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                })
            }
        </Box>
    );
};

export default Logout;
