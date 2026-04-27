import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, User, MapPin, Phone, Mail, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/clientes/novo")({
  component: NovoClientePage,
});

function NovoClientePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-background">
      <Topbar title="Novo Cliente" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/clientes" })}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-black">Cadastrar Cliente</h1>
              <p className="text-sm text-muted-foreground">Preencha os dados básicos do novo cliente</p>
            </div>
          </div>

          <Tabs defaultValue="pessoal" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="pessoal" className="gap-2"><User className="h-4 w-4" /> Dados Pessoais</TabsTrigger>
              <TabsTrigger value="endereco" className="gap-2"><MapPin className="h-4 w-4" /> Endereço</TabsTrigger>
              <TabsTrigger value="obs" className="gap-2"><FileText className="h-4 w-4" /> Observações</TabsTrigger>
            </TabsList>

            <TabsContent value="pessoal">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input id="nome" placeholder="Ex: João Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF / CNPJ</Label>
                      <Input id="cpf" placeholder="000.000.000-00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="email" className="pl-10" placeholder="joao@exemplo.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tel">Telefone / WhatsApp</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input id="tel" className="pl-10" placeholder="(00) 00000-0000" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endereco">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Localização</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="rua">Logradouro (Rua, Av...)</Label>
                      <Input id="rua" placeholder="Rua das Flores" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número</Label>
                      <Input id="numero" placeholder="123" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro</Label>
                      <Input id="bairro" placeholder="Centro" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Input id="cidade" placeholder="São Paulo" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="obs">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="notas">Observações sobre o cliente</Label>
                    <textarea 
                      id="notas" 
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Ex: Cliente prefere contato via WhatsApp..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => navigate({ to: "/clientes" })}>Cancelar</Button>
            <Button className="bg-gradient-primary shadow-glow gap-2">
              <Save className="h-4 w-4" /> Salvar Cliente
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
