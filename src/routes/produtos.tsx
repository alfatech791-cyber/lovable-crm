import { createFileRoute } from "@tanstack/react-router";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { ShoppingBag, Plus, MoreVertical, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos — ConectaCRM" },
      { name: "description", content: "Gerencie seu catálogo de produtos e serviços." },
    ],
  }),
  component: ProductsPage,
});

interface Product {
  id: number;
  name: string;
  price: string;
  stock: string;
  category: string;
}
const products: Product[] = [];

function ProductsPage() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title="Catálogo de Produtos" subtitle="Gerencie o que você vende" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-sm w-full">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Buscar produtos..." className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border outline-none text-sm" />
              </div>
              <button className="h-10 px-4 rounded-xl border border-border hover:bg-muted transition flex items-center gap-2 text-sm text-muted-foreground">
                <Filter className="h-4 w-4" /> Filtros
              </button>
            </div>
            <button className="h-10 px-4 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-elegant hover:opacity-95 transition flex items-center gap-2">
              <Plus className="h-4 w-4" /> Novo Produto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl bg-card border border-border overflow-hidden shadow-card hover:shadow-elegant transition-all group">
                <div className="h-40 bg-muted grid place-items-center relative">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30 group-hover:scale-110 transition duration-300" />
                  <div className="absolute top-3 right-3">
                    <button className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm grid place-items-center hover:bg-white text-foreground shadow-sm">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">{product.category}</div>
                  <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                  <div className="text-lg font-bold font-display text-foreground">{product.price}</div>
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">Estoque: <span className="text-foreground font-semibold">{product.stock}</span></span>
                    <button className="text-[11px] font-bold text-primary hover:underline">Ver detalhes</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
