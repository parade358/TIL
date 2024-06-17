import { Route } from 'react-router';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import ACSNavBar from './components/acsNavBar';
import Home from './view/home';
import SignIn from './view/login/login';
import MaterialInput_2P from './view/material/materialInput_2P';
import MaterialOutput from './view/material/materialOutput';
import ShipmentProduct from './view/shipment/shipmentProduct';
import ShipmentCustomerLabelReplacement from './view/shipment/shipmentCustomerLabelReplacement';
import ShipmentMultipleCustomerLabelReplacement from './view/shipment/shipmentMultipleCustomerLabelReplacement';
import InventoryInquiry from './view/inventory/inventoryInquiry';
import InventoryOutsourcingOfPrivatelyOwnedMaterials from './view/inventory/inventoryOutsourcingOfPrivatelyOwnedMaterials';
import InventoryMovingPartsList from './view/inventory/inventoryMovingPartsList';
import InventoryMovingPartsListWarehouse from './view/inventory/inventoryMovingPartsListWarehouse';
import InventoryMoveReceipt from './view/inventory/inventoryMoveReceipt';
import TransferDefectiveStock from './view/material/transferDefectiveStock';
import MovingPartsListWarehouseAuto from './view/shipment/movingPartsListWarehouseAuto';
import ShipmentProductAuto from './view/shipment/shipmentProductAuto';
import MaterialInput from './view/material/materialInput';
import ShipmentOutSideAuto from './view/shipment/shipmentOutSideAuto';
import ShipmentOutSide from './view/shipment/shipmentOutSide';
function App() {
    return (
        <>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/">
                        <Redirect from="/" to="/login" />
                    </Route>

                    <Route exact path="/login" render={() => <SignIn />} />
                    <Route
                        exact
                        path="/home"
                        render={() => (
                            <>
                                <ACSNavBar menuName="Home" menuOpened={true} />
                                <Home />
                            </>
                        )}
                    />
                    {localStorage.getItem('PDA_PLANT_ID') === '103' ? (
                        <Route exact path="/MaterialInput_2P">
                            <ACSNavBar menuName="자재입고" menuOpened={false} />
                            <MaterialInput_2P />
                        </Route>
                    ) : (
                        <Route exact path="/MaterialInput">
                            <ACSNavBar menuName="자재입고" menuOpened={false} />
                            <MaterialInput />
                        </Route>
                    )}

                    <Route exact path="/transferDefectiveStock">
                        <ACSNavBar menuName="조직간이전불량입고" menuOpened={false} />
                        <TransferDefectiveStock />
                    </Route>
                    <Route exact path="/materialOutput">
                        <ACSNavBar menuName="자재출고" menuOpened={false} />
                        <MaterialOutput />
                    </Route>

                    <Route exact path="/shipmentProduct">
                        <ACSNavBar menuName="제품출하" menuOpened={false} />
                        <ShipmentProduct />
                    </Route>
                    <Route exact path="/shipmentProductAuto">
                        <ACSNavBar menuName="제품출하 - 자동" menuOpened={false} />
                        <ShipmentProductAuto />
                    </Route>
                    <Route exact path="/shipmentOutSide">
                        <ACSNavBar menuName="조직간이전출하" menuOpened={false} />
                        <ShipmentOutSide />
                    </Route>
                    <Route exact path="/shipmentOutSideAuto">
                        <ACSNavBar menuName="조직간이전출하(낱장)" menuOpened={false} />
                        <ShipmentOutSideAuto />
                    </Route>
                    <Route exact path="/shipmentCustomerLabelReplacement">
                        <ACSNavBar menuName="고객사라벨교체출하" menuOpened={false} />
                        <ShipmentCustomerLabelReplacement />
                    </Route>
                    <Route exact path="/shipmentMultipleCustomerLabelReplacement">
                        <ACSNavBar menuName="다중고객사라벨교체출하" menuOpened={false} />
                        <ShipmentMultipleCustomerLabelReplacement />
                    </Route>
                    <Route exact path="/MovingPartsListWarehouseAuto">
                        <ACSNavBar menuName="창고이동처리 - 자동" menuOpened={false} />
                        <MovingPartsListWarehouseAuto />
                    </Route>
                    <Route exact path="/inventoryInquiry">
                        <ACSNavBar menuName="재고조회" menuOpened={false} />
                        <InventoryInquiry />
                    </Route>

                    <Route exact path="/inventoryOutsourcingOfPrivatelyOwnedMaterials">
                        <ACSNavBar menuName="사급자재외주출고" menuOpened={false} />
                        <InventoryOutsourcingOfPrivatelyOwnedMaterials />
                    </Route>

                    <Route exact path="/inventoryMovingPartsList">
                        <ACSNavBar menuName="자재위치이동" menuOpened={false} />
                        <InventoryMovingPartsList />
                    </Route>

                    <Route exact path="/inventoryMovingPartsListWarehouse">
                        <ACSNavBar menuName="재고창고이동" menuOpened={false} />
                        <InventoryMovingPartsListWarehouse />
                    </Route>

                    <Route exact path="/inventoryMoveReceipt">
                        <ACSNavBar menuName="완제품이동" menuOpened={false} />
                        <InventoryMoveReceipt />
                    </Route>
                </Switch>
            </BrowserRouter>
        </>
    );
}

export default App;
