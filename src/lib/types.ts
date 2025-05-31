export enum OrderType {
    ORDER_TYPE_UNSPECIFIED = 0,
    ORDER_TYPE_DINE_IN = 1,
    ORDER_TYPE_TAKE_AWAY = 2,
    ORDER_TYPE_DRIVE_THRU = 3,
  }
  
  export enum CartState {
    CART_STATE_UNSPECIFIED_STATE = 0,
    CART_STATE_ACTIVE = 1,
    CART_STATE_LOCKED = 2,
    CART_STATE_ABANDONED = 3,
  }
  
  export enum DiscountType {
    DISCOUNT_TYPE_UNSPECIFIED = 0,
    DISCOUNT_TYPE_PERCENTAGE = 1,
    DISCOUNT_TYPE_FIXED = 2,
  }
  
  export interface AddOn {
    cartItemUuid: string;
    addOnName: string;
    addOnUuid: string;
    quantity: number;
    unitPrice: number;
    isFree: boolean;
    subtotalAmount: number;
  }
  
  export interface CartItem {
    cartItemUuid: string;
    cartUuid: string;
    productName: string;
    productUuid: string;
    taxPercentage: number;
    discount: number;
    unitPrice: number;
    quantity: number;
    addOnsTotal: number;
    subtotalAmount: number;
    discountAmount: number;
    priceBeforeTax: number;
    taxAmount: number;
    finalPrice: number;
    packagingCost: number;
    addOns: AddOn[];
  }
  
  export interface Cart {
    storeUuid: string;
    cartUuid: string;
    userPhoneNo: string;
    orderType: OrderType;
    tableNo: string;
    vehicleNo: string;
    vehicleDescription: string;
    couponCode: string;
    specialInstructions: string;
    items: CartItem[];
    subTotal: number;
    totalDiscount: number;
    totalPriceBeforeTax: number;
    totalTax: number;
    packagingCost: number;
    finalAmount: number;
    cartState: CartState;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateCartRequest {
    storeUuid: string;
    userPhoneNo: string;
    orderType: OrderType;
    tableNo: string;
    vehicleNo: string;
    vehicleDescription: string;
  }
  
  export interface CartResponse {
    cart: Cart;
  }
  
  export interface GetCartRequest {
    storeUuid: string;
    userPhoneNo: string;
    cartUuid: string;
  }
  
  export interface UpdateCartRequest {
    storeUuid: string;
    userPhoneNo: string;
    cartUuid: string;
    orderType?: OrderType;
    tableNo?: string;
    vehicleNo?: string;
    vehicleDescription?: string;
    couponCode?: string;
    specialInstructions?: string;
  }
  
  export interface DeleteCartRequest {
    storeUuid: string;
    userPhoneNo: string;
    cartUuid: string;
  }
  
  export interface AddCartItemRequest {
    cartUuid: string;
    storeUuid: string;
    userPhoneNo: string;
    productUuid: string;
  }
  
  export interface RemoveCartItemRequest {
    cartUuid: string;
    userPhoneNo: string;
    storeUuid: string;
    cartItemUuid: string;
    productUuid: string;
  }
  
  export interface AddQuantityRequest {
    cartUuid: string;
    cartItemUuid: string;
    productUuid: string;
    storeUuid: string;
    userPhoneNo: string;
  }
  
  export interface RemoveQuantityRequest extends AddQuantityRequest {}
  
  export interface CreateAddOnRequest {
    cartUuid: string;
    cartItemUuid: string;
    addOnUuid: string;
    storeUuid: string;
    userPhoneNo: string;
  }
  
  export interface RemoveAddOnRequest extends CreateAddOnRequest {}
  
  export interface IncreaseAddOnQuantityRequest extends CreateAddOnRequest {}
  
  export interface RemoveAddOnQuantityRequest extends CreateAddOnRequest {}
  
  export interface ValidCouponRequest {
    cartUuid: string;
    couponCode: string;
    storeUuid: string;
    userPhoneNo: string;
  }
  
  export interface ValidCouponResponse {
    valid: boolean;
    message: string;
  }
  
  export interface AddCouponRequest extends ValidCouponRequest {}
  
  export interface RemoveCouponRequest {
    cartUuid: string;
    storeUuid: string;
    userPhoneNo: string;
  }
  
  export interface ValidateCartRequest {
    cartUuid: string;
    storeUuid: string;
    userPhoneNo: string;
  }
  
  export interface Coupon {
    couponUuid: string;
    storeUuid: string;
    couponCode: string;
    discountType: DiscountType;
    validFrom: string;
    validTo: string;
    usageLimitPerUser: number;
    totalUsageLimit: number;
    discount: number;
    minSpend: number;
    isForNewUsers: boolean;
    description: string;
    maxCartValue: number;
    isActive: boolean;
    maxDiscount: number;
  }
  
  export interface CouponUsage {
    usageUuid: string;
    couponUuid: string;
    userPhoneNo: string;
    usedAt: string;
    orderUuid: string;
  }
  
  export interface CreateCouponRequest {
    storeUuid: string;
    coupon: Coupon;
  }
  
  export interface GetCouponRequest {
    storeUuid: string;
    couponUuid: string;
    couponCode: string;
  }
  
  export interface UpdateCouponRequest extends Coupon {
    storeUuid: string;
  }
  
  export interface DeleteCouponRequest {
    storeUuid: string;
    couponUuid: string;
  }
  
  export interface ListCouponRequest {
    storeUuid: string;
    page: number;
    limit: number;
  }
  
  export interface ListCouponResponse {
    coupons: Coupon[];
    nextPage: number;
    prevPage: number;
  }
  
  export interface GetCouponUsageRequest {
    storeUuid: string;
    couponUuid: string;
    page: number;
    limit: number;
  }
  
  export interface GetCouponUsageResponse {
    couponUsageList: CouponUsage[];
    nextPage: number;
    prevPage: number;
  }

  
export enum ProductStatus {
    PRODUCT_STATE_DRAFT = 0,
    PRODUCT_STATE_ACTIVE = 1,
    PRODUCT_STATE_INACTIVE = 2,
    PRODUCT_STATE_OUT_OF_STOCK = 3,
  }
  
  export interface Category {
    categoryUuid: string;
    storeUuid: string;
    name: string;
    description: string;
    displayOrder: number;
    isAvailable: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateCategoryRequest {
    storeUuid: string;
    name: string;
    description: string;
    displayOrder: number;
    isAvailable: boolean;
    isActive: boolean;
  }
  
  export interface GetCategoryRequest {
    storeUuid: string;
    categoryUuid: string;
  }
  
  export interface UpdateCategoryRequest extends Partial<Omit<CreateCategoryRequest, 'storeUuid'>> {
    storeUuid: string;
    categoryUuid: string;
  }
  
  export interface ListCategoryRequest {
    storeUuid: string;
    page: number;
    limit: number;
  }
  
  export interface DeleteCategoryRequest {
    storeUuid: string;
    categoryUuid: string;
  }
  
  export interface DietaryPreference {
    storeUuid: string;
    dietPrefUuid: string;
    name: string;
    description: string;
    iconUrl: string;
  }
  
  export interface CreateDietaryPreference {
    storeUuid: string;
    name: string;
    description: string;
    iconImageBytes?: string;
  }
  
  export interface UpdateDietaryPreference {
    storeUuid: string;
    dietPrefUuid: string;
    name?: string;
    description?: string;
    iconImageBytes?: string;
  }
  
  export interface DeleteDietaryPreference {
    storeUuid: string;
    dietPrefUuid: string;
  }
  
  export interface AddOn {
    addOnUuid: string;
    name: string;
    isAvailable: boolean;
    maxSelectable: number;
    GSTPercentage: number;
    price: number;
    productUuid: string;
    createdAt: string;
    updatedAt: string;
    isFree: boolean;
  }
  
  export interface CreateAddOnRequest {
    storeUuid: string;
    productUuid: string;
    name: string;
    isAvailable: boolean;
    maxSelectable: number;
    GSTPercentage: number;
    price: number;
    isFree: boolean;
  }
  
  export interface UpdateAddOnRequest extends Partial<Omit<CreateAddOnRequest, 'storeUuid' | 'productUuid'>> {
    storeUuid: string;
    productUuid: string;
    addOnUuid: string;
  }
  
  export interface DeleteAddOnRequest {
    storeUuid: string;
    productUuid: string;
    addOnUuid: string;
  }
  
  export interface ListAddOnRequest {
    storeUuid: string;
    productUuid: string;
    page: number;
    limit: number;
  }
  
  export interface Product {
    productUuid: string;
    storeUuid: string;
    name: string;
    description: string;
    status: ProductStatus;
    isAvailable: boolean;
    displayPrice: number;
    price: number;
    GSTPercentage: number;
    category: Category;
    dietaryPref: DietaryPreference[];
    imageURL: string;
    imageBytes?: string;
    addOns: AddOn[];
    createdAt: string;
    updatedAt: string;
    packagingCost: number;
  }
  
  export interface CreateProductRequest {
    storeUuid: string;
    name: string;
    description: string;
    status: ProductStatus;
    isAvailable: boolean;
    displayPrice: number;
    price: number;
    GSTPercentage: number;
    categoryUuid: string;
    dietPrefUuid: string;
    imageBytes: string|null;
    packagingCost: number;
  }
  
  export interface UpdateProductRequest extends Partial<Omit<CreateProductRequest, 'storeUuid' | 'categoryUuid'>> {
    storeUuid: string;
    productUuid: string;
    categoryUuid: string;
    newCategoryUuid?: string;
  }
  
  export interface GetProductRequest {
    productUuid: string;
    storeUuid: string;
    categoryUuid: string;
    isActive?: boolean;
    isAvailable?: boolean;
  }
  
  export interface DeleteProductRequest {
    productUuid: string;
    storeUuid: string;
    categoryUuid: string;
  }
  
  export interface ListProductsRequest {
    storeUuid: string;
    categoryUuid: string;
    page: number;
    limit: number;
  }
  
  export interface CategoryResponse {
    category: Category;
  }
  
  export interface ProductResponse {
    product: Product;
  }
  
  export interface AddOnResponse {
    addOn: AddOn;
  }
  
  export interface DietPrefResponse {
    dietaryPreference: DietaryPreference;
  }
  
  export interface ListCategoryResponse {
    categories: Category[];
    prevPage: number;
    nextPage: number;
  }
  
  export interface ListProductsResponse {
    products: Product[];
    prevPage: number;
    nextPage: number;
  }
  
  export interface ListAddOnResponse {
    addOns: AddOn[];
    nextPage: number;
    prevPage: number;
  }
  export interface ListDietPrefRequest {
    storeUuid: string;
    limit: number;
    page: number;
  }
  export interface ListDietPrefResponse {
    dietaryPreferences: DietaryPreference[];
    nextPage: number;
    prevPage: number;
  }
  
  export interface CreateStoreRequest {
    userUuid: string;
    storeName: string;
    gstNumber: string;
    isActive: boolean;
    isOpen: boolean;
    description: string;
  }
  
  export interface UpdateStoreRequest {
    userUuid: string;
    storeUuid: string;
    storeName?: string;
    gstNumber?: string;
  }
  
  export interface Store {
    storeUuid: string;
    storeName: string;
    gstNumber: string;
    address: Address | null;
    isActive: boolean;
    isOpen: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface StoreResponse {
    userUuid: string;
    store: Store;
  }
  
  export interface GetAllStoresResponse {
    stores: Store[];
    prevPage: number;
    nextPage: number;
  }
  
  export interface Address {
    addressUuid: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AddAddressRequest {
    userUuid: string;
    storeUuid: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  }
  
  export interface UpdateAddressRequest {
    storeUuid: string;
    addressUuid: string;
    addressLine1?: string;
    addressLine2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  }
  
  export interface AddressResponse {
    storeUuid: string;
    address: Address;
  }