import { useEffect, useState } from 'react';
import { type Categoria } from '../types';
import { categoriaApi } from '../api/api';
import { ListaCategorias } from '../components/ListaCategorias';
import { FormularioCategoria } from '../components/FormularioCategoria';

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  async function carregar() {
    setCategorias(await categoriaApi.listar());
  }

  useEffect(() => {
    void carregar();
  }, []);

  return (
    <section className="page">
      <div className="page-header"><div><h2>Categorias</h2><p className="muted">Cadastre e visualize as categorias do estoque.</p></div></div>
      <ListaCategorias categorias={categorias} />
      <FormularioCategoria onCategoriaCriada={carregar} />
    </section>
  );
}
