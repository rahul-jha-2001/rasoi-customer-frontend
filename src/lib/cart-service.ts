// src/lib/server/cart-service.ts

import { apiFetch, invalidatePrefix } from "./api";

export interface AddCartItemRequest {
  storeUuid: string;
  userPhone: string;
  cartUuid: string;
  productUuid: string;
}

export interface RemoveCartItemRequest {
  storeUuid: string;
  userPhone: string;
  cartUuid: string;
  cartItemUuid: string;
  productUuid: string;
}

export interface AddQuantityRequest extends RemoveCartItemRequest {}
export interface RemoveQuantityRequest extends RemoveCartItemRequest {}

export interface CouponActionRequest {
  storeUuid: string;
  userPhone: string;
  cartUuid: string;
  couponCode: string;
}

export interface CartIdentifier {
  storeUuid: string;
  userPhone: string;
  cartUuid?: string;
}

const cartService = {
  addCartItem: async (data: AddCartItemRequest, token: string) => {
    const res = await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhone}/cart/${data.cartUuid}/cartitem`,
      "POST",
      token,
      data,
      false,
      { storeUuid: data.storeUuid, userUuid: data.userPhone }
    );
    await invalidatePrefix(`/v1/store/${data.storeUuid}/user/${data.userPhone}/cart`, {
      storeUuid: data.storeUuid,
      userUuid: data.userPhone,
    });
    return res;
  },

  getCart: async (data: CartIdentifier, token: string) => {
    const suffix = data.cartUuid ? `/${data.cartUuid}` : "";
    return await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhone}/cart${suffix}`,
      "GET",
      token,
      undefined,
      true,
      { storeUuid: data.storeUuid, userUuid: data.userPhone }
    );
  },

  removeCartItem: async (data: RemoveCartItemRequest, token: string) => {
    const res = await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhone}/cart/${data.cartUuid}/cartitem`,
      "DELETE",
      token,
      data,
      false,
      { storeUuid: data.storeUuid, userUuid: data.userPhone }
    );
    await invalidatePrefix(`/v1/store/${data.storeUuid}/user/${data.userPhone}/cart`, {
      storeUuid: data.storeUuid,
      userUuid: data.userPhone,
    });
    return res;
  },

  addQuantity: async (data: AddQuantityRequest, token: string) => {
    return await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhone}/cart/${data.cartUuid}/cartitem/${data.cartItemUuid}/Add`,
      "PATCH",
      token,
      data,
      false,
      { storeUuid: data.storeUuid, userUuid: data.userPhone }
    );
  },

  removeQuantity: async (data: RemoveQuantityRequest, token: string) => {
    return await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhone}/cart/${data.cartUuid}/cartitem/${data.cartItemUuid}/Remove`,
      "PATCH",
      token,
      data,
      false,
      { storeUuid: data.storeUuid, userUuid: data.userPhone }
    );
  },

  validateCoupon: async (data: CouponActionRequest, token: string) => {
    return await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhone}/cart/${data.cartUuid}/validate_coupon/${data.couponCode}`,
      "GET",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid, userUuid: data.userPhone }
    );
  },

  addCoupon: async (data: CouponActionRequest, token: string) => {
    return await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhone}/cart/${data.cartUuid}/coupon/${data.couponCode}`,
      "PATCH",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid, userUuid: data.userPhone }
    );
  },

  removeCoupon: async (data: CartIdentifier, token: string) => {
    return await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhone}/cart/${data.cartUuid}/removecoupon`,
      "DELETE",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid, userUuid: data.userPhone }
    );
  },
};

export default cartService;
