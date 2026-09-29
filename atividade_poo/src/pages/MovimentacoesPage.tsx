import { useEffect, useState, type FormEvent } from 'react';
import { movimentacaoApi, produtoApi } from '../api/api';
import type { Movimentacao, Produto, TipoMovimentacao } from '../types';

function mensagemDaApi(erro: unknown) {
  if (typeof erro === 'object' && erro !== null && 'response' in erro) {
    const response = (erro as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return 'Ocorreu um erro ao registrar a movimentação.';
}

function formatarData(data: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date(data));
}

export function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState<TipoMovimentacao>('ENTRADA');
  const [quantidade, setQuantidade] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function carregarDados() {
    const [historico, listaProdutos] = await Promise.all([
      movimentacaoApi.listar(),
      produtoApi.listar(),
    ]);
    setMovimentacoes(historico);
    setProdutos(listaProdutos);
  }

  useEffect(() => {
    void carregarDados();
  }, []);

  async function registrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');

    const produtoNumero = Number(produtoId);
    const quantidadeNumero = Number(quantidade);

    if (!produtoId || !Number.isInteger(produtoNumero)) {
      setErro('Produto é obrigatório.');
      return;
    }
    if (!Number.isInteger(quantidadeNumero) || quantidadeNumero <= 0) {
      setErro('Quantidade deve ser um número inteiro maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      await movimentacaoApi.criar({
        produtoId: produtoNumero,
        tipo,
        quantidade: quantidadeNumero,
      });
      await carregarDados();
      setProdutoId('');
      setTipo('ENTRADA');
      setQuantidade('');
    } catch (error) {
      setErro(mensagemDaApi(error));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div><h2>Movimentações</h2><p className="muted">Registre entradas e saídas e acompanhe o histórico.</p></div>
      </div>

      <form className="card form-card" onSubmit={registrar}>
        <h3>Nova movimentação</h3>
        {erro && <div className="alert alert-error">{erro}</div>}
        <div className="form-grid movement-grid">
          <label className="field-wide">Produto<select value={produtoId} onChange={(e) => setProdutoId(e.target.value)}><option value="">Selecione...</option>{produtos.map((produto) => <option key={produto.id} value={produto.id}>{produto.nome} — estoque atual: {produto.quantidade}</option>)}</select></label>
          <label>Tipo<select value={tipo} onChange={(e) => setTipo(e.target.value as TipoMovimentacao)}><option value="ENTRADA">Entrada</option><option value="SAIDA">Saída</option></select></label>
          <label>Quantidade<input value={quantidade} onChange={(e) => setQuantidade(e.target.value)} type="number" min="1" step="1" placeholder="1" /></label>
        </div>
        <div><button type="submit" disabled={salvando}>{salvando ? 'Registrando...' : 'Registrar movimentação'}</button></div>
      </form>

      <h3>Histórico</h3>
      {movimentacoes.length === 0 ? (
        <div className="empty">Nenhuma movimentação registrada.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Data/hora</th><th>Produto</th><th>Tipo</th><th>Quantidade</th></tr></thead>
            <tbody>
              {movimentacoes.map((movimentacao) => (
                <tr key={movimentacao.id}>
                  <td>{formatarData(movimentacao.criadoEm)}</td>
                  <td>{movimentacao.produto.nome}</td>
                  <td><span className={`badge ${movimentacao.tipo === 'ENTRADA' ? 'badge-entry' : 'badge-exit'}`}>{movimentacao.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}</span></td>
                  <td>{movimentacao.quantidade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
