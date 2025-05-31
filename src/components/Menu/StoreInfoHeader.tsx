// src/components/Menu/StoreInfoHeader.tsx



export default function StoreInfoHeader({ store }: { store: { name: string; address: string; logo?: string } }) {
    return (
      <div className="flex items-center gap-4">
        {store.logo && <img src={store.logo} alt="logo" className="w-12 h-12 rounded-md" />}
        <div>
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <p>
            {store.address?.addressLine1}, {store.address?.city}, {store.address?.state}
          </p>

        </div>
      </div>
    );
  }
  