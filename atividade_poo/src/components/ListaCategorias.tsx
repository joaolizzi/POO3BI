import type { Categoria } from '../types';

export function ListaCategorias({ categorias }: { categorias: Categoria[] }) {
  if (categorias.length === 0) return <div className="empty">Nenhuma categoria cadastrada.</div>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Nome</th></tr></thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}><td>{categoria.id}</td><td>{categoria.nome}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
