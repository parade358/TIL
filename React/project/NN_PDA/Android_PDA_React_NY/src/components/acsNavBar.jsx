import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';
import MenuIcon from '@material-ui/icons/Menu';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import menuInfoContext from '../contexts/menuInfoContext.js';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import LocalShippingRoundedIcon from '@material-ui/icons/LocalShippingRounded';
import InventoryIcon from '@mui/icons-material/Inventory';

const PDA_API_DICTIONARY_URL = process.env.REACT_APP_PDA_API_DICTIONARY_URL;
const PDA_DICTIONARY = 'USP_PDA_DICTIONARY';

export const menuOpenContext = createContext({
    setMenuOpen: () => {},
});

// 메뉴 width 설정
const drawerWidth = '90%';
const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    gridroot: {
        width: 'fit-content',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        '& svg': {
            margin: theme.spacing(1.5),
        },
        '& hr': {
            margin: theme.spacing(0, 0.5),
        },
    },
    lang: {
        textAlign: 'center',
    },
    bottomFixed: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    itemList: {
        marginLeft: '10px',
    },
    menuIcon: {
        marginRight: '5px',
        fontSize: '1.7rem',
    },
}));

function ACSNavBar({ menuName, menuOpened }) {
    const [menuOpen, setMenuOpen] = useState(menuOpened);
    const [menuText, setMenuText] = useState(menuName);
    const { t, i18n } = useTranslation(); //번역 hook
    const [expanded, setExpanded] = useState(false);
    const data = useContext(menuOpenContext);
    data.setMenuOpen = setMenuOpen;

    useEffect(() => {
        if (localStorage.getItem('PDA_LANG') !== 'K') {
            let bodyparam = {
                userPlant: localStorage.getItem('PDA_PLANT_ID'),
                serviceID: PDA_DICTIONARY,
                serviceParam: "'" + localStorage.getItem('PDA_LANG') + "'",
                serviceCallerEventType: 'useEffect',
                serviceCallerEventName: 'useEffect',
                clientNetworkType: navigator.connection.effectiveType,
            };
            //default 언어변경
            fetch(PDA_API_DICTIONARY_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyparam),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    const tmp = Object.assign({}, JSON.parse(data.returnValue[0])[0]);
                    console.log(tmp);
                    i18n.removeResourceBundle(localStorage.getItem('PDA_LANG'), 'translation');
                    i18n.addResourceBundle(localStorage.getItem('PDA_LANG'), 'translation', tmp);
                    i18n.changeLanguage(localStorage.getItem('PDA_LANG'));
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    useEffect(() => setMenuText(menuName), [menuName]);

    const eventhandler = {
        handleDrawerToggle: (e) => {
            setMenuOpen(!menuOpen);

            if (e.target.innerText !== undefined) {
                if (e.target.innerText !== '') {
                    setMenuText(e.target.innerText);
                }
            }
        },

        handleLogOut: (e) => {
            e.preventDefault();
            localStorage.removeItem('PDA_ID'); //삭제
            window.location.href = '/login';
        },
    };

    const classes = useStyles();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <>
            <menuInfoContext.Provider value={t(menuText)}>
                {/* <AppBar position='static' id="appbar" style={{backgroundColor: "#f7b13d"}}> */}
                <AppBar position="fixed" top="0px" id="appbar" style={{ backgroundColor: '#f7b13d' }}>
                    <Toolbar style={{ padding: '0px' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            style={{ margin: '0px', padding: '2px' }}
                            onClick={eventhandler.handleDrawerToggle}
                        >
                            <MenuIcon style={{ fontSize: '3.5rem' }} />
                        </IconButton>
                        <Typography variant="h6" style={{ marginLeft: '10px' }}>
                            {t(menuText)}
                        </Typography>
                    </Toolbar>
                </AppBar>

                <menuOpenContext.Provider value={setMenuOpen}>
                    <Drawer
                        open={menuOpen}
                        onClose={eventhandler.handleDrawerToggle}
                        className={classes.drawer}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        style={{ zIndex: 99999999999 }}
                    >
                        <List>
                            <ListItem
                                style={{ width: '100px', display: 'inline-block' }}
                                button
                                onClick={eventhandler.handleDrawerToggle}
                            >
                                <ListItemIcon>
                                    <CloseIcon />
                                </ListItemIcon>
                            </ListItem>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    float: 'right',
                                    margin: '5px 10px 0px 0px',
                                }}
                            >
                                <AccountCircleIcon />
                                <Typography style={{ marginLeft: '5px' }} variant="h7">
                                    {t(localStorage.getItem('PDA_NAME'))}
                                </Typography>
                            </div>
                            <Divider />
                            <Link
                                to="/home"
                                style={{ textDecoration: 'none', color: '#000' }}
                                onClick={eventhandler.handleDrawerToggle}
                            >
                                <ListItem button>
                                    <HomeIcon className={classes.menuIcon} />
                                    <ListItemText primary={t('Home')} />
                                </ListItem>
                            </Link>
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />

                            <Accordion expanded={expanded === 'material'} onChange={handleChange('material')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    style={{ height: '15px' }}
                                >
                                    <ListItem>
                                        <SettingsIcon className={classes.menuIcon} />
                                        <ListItemText primary={t('자재관리')} />
                                    </ListItem>
                                </AccordionSummary>
                                <AccordionDetails style={{ display: 'block' }}>
                                    {localStorage.getItem('PDA_PLANT_ID') === '103' ? (
                                        <>
                                            <Divider />
                                            <Link
                                                to="/MaterialInput_2P"
                                                style={{ textDecoration: 'none', color: '#000' }}
                                                onClick={eventhandler.handleDrawerToggle}
                                            >
                                                <ListItem button className={classes.itemList}>
                                                    <DescriptionIcon />
                                                    <ListItemText primary={t('자재입고')} />
                                                </ListItem>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Divider />
                                            <Link
                                                to="/MaterialInput"
                                                style={{ textDecoration: 'none', color: '#000' }}
                                                onClick={eventhandler.handleDrawerToggle}
                                            >
                                                <ListItem button className={classes.itemList}>
                                                    <DescriptionIcon />
                                                    <ListItemText primary={t('자재입고')} />
                                                </ListItem>
                                            </Link>
                                        </>
                                    )}

                                    <Divider />
                                    <Link
                                        to="/transferDefectiveStock"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('조직간이전불량입고')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/materialOutput"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('자재출고')} />
                                        </ListItem>
                                    </Link>
                                </AccordionDetails>
                            </Accordion>

                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />

                            <Accordion expanded={expanded === 'shipment'} onChange={handleChange('shipment')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    style={{ height: '15px' }}
                                >
                                    <ListItem>
                                        <LocalShippingRoundedIcon className={classes.menuIcon} />
                                        <ListItemText primary={t('출하관리')} />
                                    </ListItem>
                                </AccordionSummary>
                                <AccordionDetails style={{ display: 'block' }}>
                                    <Divider />
                                    <Link
                                        to="/shipmentProduct"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('제품출하')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/shipmentProductAuto"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('제품출하 - 자동')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/shipmentOutSide"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('조직간이전출하')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/shipmentOutSideAuto"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('조직간이전출하(낱장)')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/shipmentCustomerLabelReplacement"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('고객사라벨교체출하')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/shipmentMultipleCustomerLabelReplacement"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('다중고객사라벨교체출하')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/movingPartsListWarehouseAuto"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('창고이동처리 - 자동')} />
                                        </ListItem>
                                    </Link>
                                </AccordionDetails>
                            </Accordion>

                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />
                            <Divider />

                            <Accordion expanded={expanded === 'inventory'} onChange={handleChange('inventory')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    style={{ height: '15px' }}
                                >
                                    <ListItem>
                                        <InventoryIcon className={classes.menuIcon} />
                                        <ListItemText primary={t('재고관리')} />
                                    </ListItem>
                                </AccordionSummary>
                                <AccordionDetails style={{ display: 'block' }}>
                                    <Divider />
                                    <Link
                                        to="/inventoryInquiry"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('재고조회')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/inventoryOutsourcingOfPrivatelyOwnedMaterials"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('사급자재외주출고')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/inventoryMovingPartsList"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('부품표위치이동')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/inventoryMovingPartsListWarehouse"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('부품표창고이동')} />
                                        </ListItem>
                                    </Link>
                                    <Divider />
                                    <Link
                                        to="/inventoryMoveReceipt"
                                        style={{ textDecoration: 'none', color: '#000' }}
                                        onClick={eventhandler.handleDrawerToggle}
                                    >
                                        <ListItem button className={classes.itemList}>
                                            <DescriptionIcon />
                                            <ListItemText primary={t('완제품이동')} />
                                        </ListItem>
                                    </Link>
                                </AccordionDetails>
                            </Accordion>
                        </List>
                        <List>
                            <div>
                                <Button
                                    variant="outlined"
                                    style={{
                                        width: '100%',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        backgroundColor: 'gray',
                                        color: 'white',
                                        border: '1px solid lightgray',
                                        textTransform: 'none',
                                    }}
                                    onClick={eventhandler.handleLogOut}
                                >
                                    {t('로그아웃')}
                                </Button>
                            </div>
                        </List>
                    </Drawer>
                </menuOpenContext.Provider>
            </menuInfoContext.Provider>
        </>
    );
}

export default ACSNavBar;
