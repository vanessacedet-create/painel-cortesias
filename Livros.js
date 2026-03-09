import { useEffect, useState } from 'react'
import { getLivros, createLivro, updateLivro, deleteLivro } from '../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const EMPTY = { titulo: '', autor: '', isbn: '', editora: '', ano: '', sinopse: '' }

export default function Livros() {
  const [livros, setLivros]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)
  const [search, setSearch]   = useState('')
  const [toast, setToast]     = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setLivros(await getLivros()) }
    catch (e) { showToast('Erro ao carregar livros', 'error') }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(EMPTY); setModal(true) }
  function openEdit(l) { setEditing(l); setForm({ ...l }); setModal(true) }
  function closeModal() { setModal(false); setEditing(null) }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSave() {
    if (!form.titulo.trim()) return
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateLivro(editing.id, form)
        setLivros(prev => prev.map(l => l.id === updated.id ? updated : l))
        showToast('Livro atualizado!')
      } else {
        const novo = await createLivro(form)
        setLivros(prev => [...prev, novo].sort((a, b) => a.titulo.localeCompare(b.titulo)))
        showToast('Livro cadastrado!')
      }
      closeModal()
    } catch (e) {
      showToast('Erro ao salvar livro', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este livro?')) return
    try {
      await deleteLivro(id)
      setLivros(prev => prev.filter(l => l.id !== id))
      showToast('Livro excluído!')
    } catch (e) {
      showToast('Erro ao excluir', 'error')
    }
  }

  const filtered = livros.filter(l =>
    l.titulo.toLowerCase().includes(search.toLowerCase()) ||
    (l.autor || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Livros</h1>
          <p className="page-subtitle">{livros.length} livro{livros.length !== 1 ? 's' : ''} disponível{livros.length !== 1 ? 'is' : ''} para cortesia</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Novo Livro
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <span className="table-title">Catálogo de Livros</span>
          <input
            className="search-input"
            placeholder="Buscar título ou autor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /><span>Carregando...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>{search ? 'Nenhum livro encontrado.' : 'Nenhum livro cadastrado ainda.'}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Editora</th>
                <th>Ano</th>
                <th>ISBN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.titulo}</td>
                  <td className="td-muted">{l.autor || '—'}</td>
                  <td className="td-muted">{l.editora || '—'}</td>
                  <td className="td-muted">{l.ano || '—'}</td>
                  <td className="td-muted">{l.isbn || '—'}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(l)} title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(l.id)} title="Excluir">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Editar Livro' : 'Novo Livro'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Título *</label>
                <input className="form-input" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Título do livro" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Autor</label>
                  <input className="form-input" value={form.autor} onChange={e => setForm(f => ({ ...f, autor: e.target.value }))} placeholder="Nome do autor" />
                </div>
                <div className="form-group">
                  <label className="form-label">Editora</label>
                  <input className="form-input" value={form.editora} onChange={e => setForm(f => ({ ...f, editora: e.target.value }))} placeholder="Editora" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">ISBN</label>
                  <input className="form-input" value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} placeholder="978-..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Ano</label>
                  <input className="form-input" type="number" value={form.ano} onChange={e => setForm(f => ({ ...f, ano: e.target.value }))} placeholder="2024" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Sinopse</label>
                <textarea className="form-textarea" value={form.sinopse} onChange={e => setForm(f => ({ ...f, sinopse: e.target.value }))} placeholder="Breve descrição do livro..." />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.titulo.trim()}>
                {saving ? 'Salvando...' : editing ? 'Salvar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
