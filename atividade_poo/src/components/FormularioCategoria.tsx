import { useState, type FormEvent } from 'react';
import { categoriaApi } from '../api/api';

export function FormularioCategoria({ onCategoriaCriada }: { onCategoriaCriada: () => void }) {
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
    if (!nome.trim()) {
      setErro('Nome da categoria é obrigatório.');
      return;
    }
    await categoriaApi.criar(nome.trim());
    setNome('');
    onCategoriaCriada();
  }

  return (
    <form className="card form-card" onSubmit={enviar}>
      <h3>Nova categoria</h3>
      {erro && <div className="alert alert-error">{erro}</div>}
      <label>
        Nome
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Alimentos" />
      </label>
      <div><button type="submit">Cadastrar categoria</button></div>
    </form>
  );
}
