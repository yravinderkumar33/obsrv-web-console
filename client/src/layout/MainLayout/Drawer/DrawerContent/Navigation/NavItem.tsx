import { forwardRef, useEffect, ForwardRefExoticComponent, RefAttributes } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

import { activeItem } from 'store/reducers/menu';

import { LinkTarget, NavItemType } from 'types/menu';
import { RootStateProps } from 'types/root';



interface Props {
    item: NavItemType;
    level: number;
    handleDrawerToggle: () => void;
}

const NavItem = ({ item, level, handleDrawerToggle }: Props) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const menu = useSelector((state: RootStateProps) => state.menu);
    const { drawerOpen, openItem } = menu;

    let itemTarget: LinkTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps: {
        component: ForwardRefExoticComponent<RefAttributes<HTMLAnchorElement>> | string;
        href?: string;
        target?: LinkTarget;
        onClick?: () => void;
    } = {
        component: forwardRef((props, ref) => <Link {...props} to={item.url!} target={itemTarget} />),
        onClick: () => { }
    };
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }

    const Icon = item.icon!;
    const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

    const isSelected = openItem.findIndex((id) => id === item.id) > -1;

    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname && pathname.includes('product-details')) {
            if (item.url && item.url.includes('product-details')) {
                dispatch(activeItem({ openItem: [item.id] }));
            }
        }

        if (pathname && pathname.includes('kanban')) {
            if (item.url && item.url.includes('kanban')) {
                dispatch(activeItem({ openItem: [item.id] }));
            }
        }

        if (pathname === item.url) {
            dispatch(activeItem({ openItem: [item.id] }));
        }

    }, [pathname]);

    const textColor = 'grey.400';
    const iconSelectedColor = 'text.primary';

    return (
        <ListItemButton
            {...listItemProps}
            disabled={item.disabled}
            selected={isSelected}
            sx={{
                zIndex: 1201,
                pl: drawerOpen ? `${level * 28}px` : 1.5,
                py: !drawerOpen && level === 1 ? 1.25 : 1,
                ...(drawerOpen && {
                    '&:hover': {
                        bgcolor: 'divider'
                    },
                    '&.Mui-selected': {
                        bgcolor: 'divider',
                        borderRight: `2px solid ${theme.palette.primary.main}`,
                        color: iconSelectedColor,
                        '&:hover': {
                            color: iconSelectedColor,
                            bgcolor: 'divider'
                        }
                    }
                }),
                ...(!drawerOpen && {
                    '&:hover': {
                        bgcolor: 'transparent'
                    },
                    '&.Mui-selected': {
                        '&:hover': {
                            bgcolor: 'transparent'
                        },
                        bgcolor: 'transparent'
                    }
                })
            }}
        >
            {itemIcon && (
                <ListItemIcon
                    sx={{
                        minWidth: 28,
                        color: isSelected ? iconSelectedColor : textColor,
                        ...(!drawerOpen && {
                            borderRadius: 1.5,
                            width: 36,
                            height: 36,
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                bgcolor: 'secondary.light'
                            }
                        }),
                        ...(!drawerOpen &&
                            isSelected && {
                            bgcolor: 'primary.900',
                            '&:hover': {
                                bgcolor: 'primary.darker'
                            }
                        })
                    }}
                >
                    {itemIcon}
                </ListItemIcon>
            )}
            {(drawerOpen || (!drawerOpen && level !== 1)) && (
                <ListItemText
                    primary={
                        <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                            {item.title}
                        </Typography>
                    }
                />
            )}
            {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
                <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                />
            )}
        </ListItemButton>
    );
};

export default NavItem;
