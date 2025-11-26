'use client'

import React, { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { criarCategoria } from '../actions'

const initialState = {
  success: false,
  error: undefined,
}

function CreateCategoryForm() {
  const [state, formAction] = useActionState(criarCategoria, initialState)
  const { pending } = useFormStatus()
  const [isOpen, setIsOpen] = React.useState(false)


  React.useEffect(() => {
    if (state.success) {
      setIsOpen(false) 
    }
  }, [state.success])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Categoria</DialogTitle>
          <DialogDescription>
            Insira o nome da categoria. A validação Zod garantirá que o nome seja válido.
          </DialogDescription>
        </DialogHeader>
        
        {                                                        }
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Ex: Pizzas, Bebidas..."
                className="col-span-3"
                // IMPORTANTE: SEM required AQUI! O Zod faz a validação
              />
            </div>
            
            {/* 🚨 AQUI É ONDE A MENSAGEM DO ZOD APARECE 🚨 */}
            {state.error && (
              <p className="col-span-4 text-sm text-red-500 text-center">
                {state.error}
              </p>
            )}

          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCategoryForm;