import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getProdutos } from './actions'
import AddProdutos from './_components/add-produtos'
import EditProduto from './_components/edit-produto'
import DeleteProduto from './_components/delete-produto'

export default async function ProdutosPage() {
  const produtos = await getProdutos()

  return (
    <div className="p-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus produtos aqui.</p>
        </div>
        <AddProdutos />
      </header>

      {produtos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum produto encontrado.</p>
            <AddProdutos />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {produtos.map(produto => (
            <Card key={produto.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">{produto.nome}</CardTitle>
                {produto.descricao && (
                  <CardDescription className="line-clamp-2">
                    {produto.descricao}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Preço:</span>
                    <Badge variant="secondary">
                      R$ {produto.preco.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Estoque:</span>
                    <Badge variant={produto.estoque > 10 ? 'default' : produto.estoque > 0 ? 'secondary' : 'destructive'}>
                      {produto.estoque} unidades
                    </Badge>
                  </div>
                  {produto.categoria && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Categoria:</span>
                      <Badge variant="outline">{produto.categoria.nome}</Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">ID: {produto.id}</p>
                </div>
              </CardContent>
              <CardFooter className='flex items-center justify-end gap-2'>
                <EditProduto produto={produto} />
                <DeleteProduto produto={produto} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
