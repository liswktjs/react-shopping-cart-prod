import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCheckBox, useCartItem } from 'hooks';

import { 비동기_요청, 알림_메시지 } from 'constants/';

import { requestChangeItemQuantity, requestPurchaseCartItem } from 'api';
import Layout from 'components/Layout';
import PageHeader from 'components/@common/PageHeader';
import CartList from 'components/CartList';
import CartReceipt from 'components/CartReceipt';

import { handleRequestDeleteCartItem } from 'utils/deleteCartItem';
import { snackbar } from 'actions/snackbar';
import { deleteCartItem, setCartList, modifyCartItemQuantity } from 'actions/cart';

import * as CommonStyled from 'components/@common/CommonStyle/styles';
import * as Styled from './styles';

const Cart = () => {
  const cartList = useCartItem();
  const dispatch = useDispatch();
  const { checkboxItems, setCheckboxItems, handleChecked, isChecked, clearCheckBoxItems } =
    useCheckBox();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const checkAllSelectButton = () => {
    if (cartList.length < 0) {
      return;
    }
    if (checkboxItems.length >= cartList.length) {
      setCheckboxItems([]);
      return;
    }
    setCheckboxItems(cartList.map((item) => Number(item.id)));
  };

  useEffect(() => {
    dispatch(setCartList());
  }, [dispatch]);

  useEffect(() => {
    setCheckboxItems(cartList.map((item) => Number(item.id)));
  }, [cartList]);

  useEffect(() => {
    setTotalPrice(
      cartList && cartList.length > 0
        ? cartList.reduce((prev, cur) => {
            if (checkboxItems.includes(Number(cur.id))) {
              return prev + cur.price * cur.quantity;
            }
            return prev;
          }, 0)
        : 0,
    );
    setIsAllChecked(cartList && cartList.length === checkboxItems.length);
  }, [cartList, checkboxItems]);

  const deleteSelectedItem = async () => {
    if (checkboxItems.length <= 0) {
      return;
    }
    const requestResult = await handleRequestDeleteCartItem(checkboxItems, dispatch);
    if (requestResult) {
      clearCheckBoxItems();
      dispatch(snackbar.pushMessageSnackbar(알림_메시지.장바구니_다중_삭제));
    }
  };

  const handleItemCount = async (productId, count) => {
    const response = await requestChangeItemQuantity(productId, count);
    if (response.status === 비동기_요청.SUCCESS) {
      dispatch(modifyCartItemQuantity(productId, count));
      return;
    }
    alert('상품 수량 조정에 실패하였습니다!');
  };

  const onPurchaseButtonClick = async () => {
    const response = await requestPurchaseCartItem({ productIds: checkboxItems });
    if (response.status === 비동기_요청.SUCCESS) {
      const purchaseResult = cartList.reduce((prev, cur) => {
        if (checkboxItems.includes(cur.id)) {
          return prev.concat(`상품: ${cur.name}, 수량: ${cur.quantity}     `);
        }
        return prev;
      }, '');
      alert(purchaseResult);
      dispatch(deleteCartItem(checkboxItems));
    }
  };

  return (
    <Layout>
      <Styled.CartListContainer>
        <PageHeader>장바구니</PageHeader>
        <CommonStyled.Container alignItems="flex-start" width="100%" margin="0">
          <CommonStyled.FlexWrapper margin="2rem" flexDirection="column" alignItems="flex-start">
            {cartList && cartList.length > 0 ? (
              <CartList
                cartList={cartList}
                isAllChecked={isAllChecked}
                checkboxItemCount={checkboxItems !== [] ? checkboxItems.length : 0}
                checkAllSelectButton={() => checkAllSelectButton}
                deleteSelectedItem={() => deleteSelectedItem}
                isChecked={isChecked}
                handleChecked={() => handleChecked}
                handleItemCount={() => handleItemCount}
              />
            ) : (
              <div>상품이 텅 비었습니다</div>
            )}
          </CommonStyled.FlexWrapper>
          <CartReceipt
            totalPrice={totalPrice}
            checkboxItemCount={checkboxItems.length}
            onPurchaseButtonClick={onPurchaseButtonClick}
          />
        </CommonStyled.Container>
      </Styled.CartListContainer>
    </Layout>
  );
};

export default Cart;
