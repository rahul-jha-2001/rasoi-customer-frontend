// src/lib/server/cart-service.ts

import { CartItem } from "@/lib/types";
import { apiFetch } from "./api-fetch";
import type {
  CreateCartRequest,
  GetCartRequest,
  UpdateCartRequest,
  DeleteCartRequest,
  AddCartItemRequest,
  RemoveCartItemRequest,
  AddQuantityRequest,
  RemoveQuantityRequest,
  CreateAddOnRequest,
  RemoveAddOnRequest,
  IncreaseAddOnQuantityRequest,
  RemoveAddOnQuantityRequest,
  ValidCouponRequest,
  AddCouponRequest,
  RemoveCouponRequest,
  ValidateCartRequest,
  CartResponse
} from "@/lib/types"


const cartService = {
  createCart: async (data: CreateCartRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart`,
      "POST",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),

  getCart: async (data: GetCartRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}`,
      "GET",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid }
    ),


  updateCart: async (data: UpdateCartRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}`,
      "PATCH",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),


  addCartItem: async (data: AddCartItemRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/cartitem`,
      "POST",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),

  removeCartItem: async (data: RemoveCartItemRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/cartitem`,
      "DELETE",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),

  addQuantity: async (data: AddQuantityRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/cartitem/${data.cartItemUuid}/add`,
      "PATCH",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),

  removeQuantity: async (data: RemoveQuantityRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/cartitem/${data.cartItemUuid}/remove`,
      "PATCH",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),

  createAddOn: async (data: CreateAddOnRequest, token: string | null) : Promise<CartResponse>=>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/cartitem/${data.cartItemUuid}/addon`,
      "POST",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),

  removeAddOn: async (data: RemoveAddOnRequest, token: string | null) : Promise<CartResponse>=>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/cartitem/${data.cartItemUuid}/addon/${data.addOnUuid}`,
      "DELETE",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid }
    ),

  increaseAddOnQuantity: async (data: IncreaseAddOnQuantityRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/cartitem/${data.cartItemUuid}/addon/${data.addOnUuid}/add_quantity`,
      "PATCH",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),

  removeAddOnQuantity: async (data: RemoveAddOnQuantityRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/cartitem/${data.cartItemUuid}/addon/${data.addOnUuid}/remove_quantity`,
      "PATCH",
      token,
      data,
      false,
      { storeUuid: data.storeUuid }
    ),

  validateCoupon: async (data: ValidCouponRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/validate_coupon/${data.couponCode}`,
      "GET",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid }
    ),

  addCoupon: async (data: AddCouponRequest, token: string | null): Promise<CartResponse> =>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/coupon/${data.couponCode}`,
      "PATCH",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid }
    ),

  removeCoupon: async (data: RemoveCouponRequest, token: string | null) : Promise<CartResponse>=>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/removecoupon`,
      "DELETE",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid }
    ),

  validateCart: async (data: ValidateCartRequest, token: string | null) : Promise<CartResponse>=>
    await apiFetch(
      `/v1/store/${data.storeUuid}/user/${data.userPhoneNo}/cart/${data.cartUuid}/validate`,
      "GET",
      token,
      undefined,
      false,
      { storeUuid: data.storeUuid }
    ),
}

export default cartService

