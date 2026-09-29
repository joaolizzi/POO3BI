import { useEffect, useState } from 'react';
import { produtoApi, categoriaApi } from '../api/api';
import type { Produto, Categoria } from '../types';

const LIMITE_ESTOQUE_BAIXO = 10;

export function DashboardHome() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    Promise.all([produtoApi.listar(), categoriaApi.listar()]).then(([produtosData, categoriasData]) => {
      setProdutos(produtosData);
      setCategorias(categoriasData);
    });
  }, []);

  const totalUnidadesEmEstoque = produtos.reduce((soma, p) => soma + p.quantidade, 0);
  const produtosEstoqueBaixo = produtos.filter((p) => p.quantidade < LIMITE_ESTOQUE_BAIXO);

  return (
    <section className="page">
      <div className="page-header"><div><h2>Visão Geral</h2><p className="muted">Resumo atual do estoque.</p></div></div>
      <div className="cards-grid">
        <Card titulo="Produtos cadastrados" valor={produtos.length} />
        <Card titulo="Categorias" valor={categorias.length} />
        <Card titulo="Unidades em estoque" valor={totalUnidadesEmEstoque} />
        <Card titulo="Estoque baixo" valor={produtosEstoqueBaixo.length} destaque={produtosEstoqueBaixo.length > 0} />
      </div>
      {produtosEstoqueBaixo.length > 0 && (
        <div className="card">
          <h3>Produtos com estoque baixo</h3>
          <ul>
            {produtosEstoqueBaixo.map((p) => <li key={p.id}>{p.nome} — {p.quantidade} unidade(s)</li>)}
          </ul>
        </div>
      )}
    </section>
  );
}

function Card({ titulo, valor, destaque = false }: { titulo: string; valor: number; destaque?: boolean }) {
  return <div className={`metric-card ${destaque ? 'metric-danger' : ''}`}><span>{titulo}</span><strong>{valor}</strong></div>;
}
