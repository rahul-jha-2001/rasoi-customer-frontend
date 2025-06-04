import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import cartService from "@/lib/cart-service"
import { Cart,OrderType } from "@/lib/types"


export async function POST(request: NextRequest, token: string) {
  try {
    const { searchParams } = new URL(request.url);
    const storeUuid = searchParams.get("storeUuid");
    const userPhoneNo = searchParams.get("userPhoneNo");

    console.log("storeUuid:", storeUuid);
    console.log("userPhoneNo:", userPhoneNo);
    // Validate required parameters

    if (!storeUuid || !userPhoneNo) {
      return NextResponse.json({ error: "Missing storeUuid, userPhoneNo, or cartUuid" }, { status: 400 });
    }

    // Fetch the cart using the service
    const cartResponse = await cartService.createCart({ 
      storeUuid, 
      userPhoneNo, 
      orderType: "default", 
      tableNo: null, 
      vehicleNo: null, 
      vehicleDescription: null 
    }, token);

    if (!cartResponse) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(cartResponse.cart);
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching the cart" }, { status: 500 });
  }
}
