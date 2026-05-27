"use client";
import dynamic from "next/dynamic";

const StoreClient = dynamic(() => import("./StoreClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Loading Store...</p>
      </div>
    </div>
  ),
});

export default function StorePage() {
  return <StoreClient />;
}
