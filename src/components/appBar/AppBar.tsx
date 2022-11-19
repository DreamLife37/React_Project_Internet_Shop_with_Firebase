import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import {useAuth} from "../../hooks/use-auth";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/redux-hooks";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {logoutTC} from "../../store/slices/authSlice";


export function MenuAppBar() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    let navigate = useNavigate();
    const {isAuth} = useAuth()
    const amountCart = useAppSelector(state => state.products.cart.amount)
    const dispatch = useAppDispatch()

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMyOrders = () => {
        setAnchorEl(null);
        navigate('/myorders')
    };

    const handleLogout = () => {
        dispatch(logoutTC())
        setAnchorEl(null);
    }

    return (
        <Box sx={{flexGrow: 1, height: '60px'}}>
            <AppBar position="static">
                <Toolbar>
                    {/*<IconButton*/}
                    {/*    size="large"*/}
                    {/*    edge="start"*/}
                    {/*    color="inherit"*/}
                    {/*    aria-label="menu"*/}
                    {/*    sx={{mr: 2}}*/}
                    {/*>*/}
                    {/*    <MenuIcon/>*/}
                    {/*</IconButton>*/}
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        <div style={{cursor: "pointer"}} onClick={() => {
                            navigate('/')
                        }}>Интернет магазин by DevAndreyIT
                        </div>
                    </Typography>
                    {isAuth && <Link to={'/cart'} style={{display: "flex", textDecoration: "none"}}>
                        <ShoppingCartIcon style={{color: "white", paddingRight: '10px'}}/>
                        <span style={{
                            color: "white",
                            textDecoration: "none",
                            paddingRight: '15px'
                        }}>{`${amountCart > 0 ? (`${amountCart}$`) : ''}`}</span>
                    </Link>}
                    {isAuth && (
                        <div>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleMyOrders}>Мои заказы</MenuItem>
                                <MenuItem onClick={handleLogout}>Выход</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}
