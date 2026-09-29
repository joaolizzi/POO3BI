import { useEffect, useState, type FormEvent } from 'react';
import { categoriaApi, produtoApi } from '../api/api';
import type { Categoria, Produto } from '../types';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function mensagemDaApi(erro: unknown) {
  if (typeof erro === 'object' && erro !== null && 'response' in erro) {
    const response = (erro as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Ocorreu um erro ao cadastrar o produto.';
}

export function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function carregarDados() {
    const [listaProdutos, listaCategorias] = await Promise.all([
      produtoApi.listar(),
      categoriaApi.listar(),
    ]);
    setProdutos(listaProdutos);
    setCategorias(listaCategorias);
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  function limparFormulario() {
    setNome('');
    setPreco('');
    setQuantidade('');
    setCategoriaId('');
  }

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');

    const precoNumero = Number(preco.replace(',', '.'));
    const quantidadeNumero = Number(quantidade);
    const categoriaNumero = Number(categoriaId);

    if (!nome.trim()) {
      setErro('Nome é obrigatório.');
      return;
    }
    if (!Number.isFinite(precoNumero) || precoNumero <= 0) {
      setErro('Preço deve ser maior que zero.');
      return;
    }
    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero < 0) {
      setErro('Quantidade deve ser um número inteiro maior ou igual a zero.');
      return;
    }
    if (!categoriaId || !Number.isInteger(categoriaNumero)) {
      setErro('Categoria é obrigatória.');
      return;
    }

    setSalvando(true);
    try {
      await produtoApi.criar({
        nome: nome.trim(),
        preco: precoNumero,
        quantidade: quantidadeNumero,
        categoriaId: categoriaNumero,
      });
      await carregarDados();
      limparFormulario();
    } catch (error) {
      setErro(mensagemDaApi(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div><h2>Produtos</h2><p className="muted">Produtos cadastrados e saldo atual em estoque.</p></div>
      </div>

      {produtos.length === 0 ? (
        <div className="empty">Nenhum produto cadastrado.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Estoque</th></tr></thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.categoria.nome}</td>
                  <td>{moeda.format(produto.preco)}</td>
                  <td>{produto.quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form className="card form-card" onSubmit={cadastrar}>
        <h3>Novo produto</h3>
        {erro && <div className="alert alert-error">{erro}</div>}
        <div className="form-grid">
          <label className="field-wide">Nome<input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Arroz 5 kg" /></label>
          <label>Preço<input value={preco} onChange={(e) => setPreco(e.target.value)} inputMode="decimal" placeholder="0,00" /></label>
          <label>Quantidade inicial<input value={quantidade} onChange={(e) => setQuantidade(e.target.value)} type="number" min="0" step="1" placeholder="0" /></label>
          <label className="field-wide">Categoria<select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}><option value="">Selecione...</option>{categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}</select></label>
        </div>
        <div><button type="submit" disabled={salvando}>{salvando ? 'Cadastrando...' : 'Cadastrar produto'}</button></div>
      </form>
    </section>
  );
}
