import { Stockouts } from "@/components/estoque/Stockouts";

export default function RupturaEstoquePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Ruptura de Estoque</h1>
      <Stockouts />
    </div>
  );
}
