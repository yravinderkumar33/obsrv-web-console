import { Box, Fab } from '@mui/material';
import { useState } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const ScrollButton = () => {
    const [icon, setIcon] = useState(<ArrowDownOutlined />);
    const [scrollDirection, setScrollDirection] = useState<string>('bottom');
    const toggleScroll = () => {
        if (scrollDirection === 'bottom') {
            scrollToBottom();
            setIcon(<ArrowUpOutlined />);
            setScrollDirection('top');
        }
        else {
            scrollToTop();
            setIcon(<ArrowDownOutlined />);
            setScrollDirection('bottom');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const scrollToBottom = () => {
        const scrollingElement = (document.scrollingElement || document.body);
        window.scrollTo({
            top: scrollingElement.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (<Box sx={{ position: 'fixed', bottom: 0, mb: 3, right: 0, mr: 1 }}>
        <Fab
            size='medium'
            onClick={() => toggleScroll()}
            sx={{ minWidth: 'unset' }}
            color='info'
        >
            {icon}
        </Fab>
    </Box>);
};

export default ScrollButton;
