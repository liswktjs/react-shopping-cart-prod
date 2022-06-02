import requestAsync from './RequestAsync';

const requestGetProductList = async () => requestAsync.get('products');
const requestGetProduct = async (id) => requestAsync.get(`product?id=${id}`);
const requestLogin = async (id, password) => requestAsync.post('login', { username: id, password });
const requestCheckDuplicatedId = async (id) =>
  requestAsync.get('customers/username/duplication', { username: id });

const requestSignUp = async (formData) => requestAsync.post('customers', formData);
const requestEditUserInfo = async (formData) => requestAsync.put('customers/me', formData, true);
const requestWithDrawUser = async () => requestAsync.delete('customers/me', true);

export {
  requestGetProductList,
  requestGetProduct,
  requestLogin,
  requestCheckDuplicatedId,
  requestSignUp,
  requestEditUserInfo,
  requestWithDrawUser,
};
