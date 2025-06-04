// src/components/Menu/StoreInfoHeader.tsx
"use client";

import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Store } from "@/lib/types"


export default function StoreInfoHeader({ store }: { store: Store }) {
    return (
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
            <Image src="/placeholder.svg?height=200&width=200" alt="Restaurant Logo" fill className="object-cover" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{store.storeName}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-2 text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start gap-1">
                <MapPin className="h-4 w-4" />
                <span>{store.address?.addressLine1}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-6" />
      </div>
    );
  }
  