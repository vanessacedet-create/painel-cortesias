import { useEffect, useState } from 'react'
import { getParceiros, createParceiro, updateParceiro, deleteParceiro } from '../lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const CANAIS = ['Instagram', 'YouTube', 'Blog', 'TikTok', 'Podcast', 'Twitter/X', 'Newsletter', 'Outro']
const TIPOS  = ['Influencer', 'Jornalista', 'Blogueiro', 'Bookstagram', 'BookTuber', 'Livraria', 'Escola', 'Outro']

const EMPTY = { nome: '', email: '', canal: '', tipo: '', seguidores: '', observacoes: '' }

export default function Parceiros() {
  const [parceiros, setParceiros] = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [search, setSearch]       = useState('')
  const [toast, setToast]         = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try { setParceiros(await getParceiros()) }
    catch (e) { showToast('Erro ao carregar parceiros', 'error') }
    finally { setLoading(false) }
  }

  function openNew() { setEditing(null); setForm(EMPTY); setModal(true) }
  function openEdit(p) { setEditing(p); setForm({ ...p }); setModal(true) }
  function closeModal() { setModal(false); setEditing(null); setForm(EMPTY) }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSave() {
    if (!form.nome.trim()) return
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateParceiro(editing.id, form)
        setParceiros(prev => prev.map(p => p.id === updated.id ? updated : p))
        showToast('Parceiro atualizado!')
      } else {
        const novo = await createParceiro(form)
        setParceiros(prev => [...prev, novo].sort((a, b) => a.nome.localeCompare(b.nome)))
        showToast('Parceiro cadastrado!')
      }
      closeModal()
    } catch (e) {
      showToast('Erro ao salvar parceiro', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este parceiro?')) return
    try {
      await deleteParceiro(id)
      setParceiros(prev => prev.filter(p => p.id !== id))
      showToast('Parceiro excluído!')
    } catch (e) {
      showToast('Erro ao excluir', 'error')
    }
  }

  const filtered = parceiros.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    (p.canal || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Parceiros</h1>
          <p className="page-subtitle">{parceiros.length} parceiro{parceiros.length !== 1 ? 's' : ''} cadastrado{parceiros.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Novo Parceiro
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <span className="table-title">Lista de Parceiros</span>
          <input
            className="search-input"
            placeholder="Buscar parceiro..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /><span>Carregando...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>{search ? 'Nenhum parceiro encontrado.' : 'Nenhum parceiro cadastrado ainda.'}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Canal</th>
                <th>Tipo</th>
                <th>E-mail</th>
                <th>Seguidores</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.nome}</td>
                  <td className="td-muted">{p.canal || '—'}</td>
                  <td>
                    {p.tipo ? <span className="badge badge-gray">{p.tipo}</span> : <span className="td-muted">—</span>}
                  </td>
                  <td className="td-muted">{p.email || '—'}</td>
                  <td className="td-muted">{p.seguidores ? Number(p.seguidores).toLocaleString('pt-BR') : '—'}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)} title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(p.id)} title="Excluir">
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
              <h2 className="modal-title">{editing ? 'Editar Parceiro' : 'Novo Parceiro'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input className="form-input" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome do parceiro" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Canal</label>
                  <select className="form-select" value={form.canal} onChange={e => setForm(f => ({ ...f, canal: e.target.value }))}>
                    <option value="">Selecionar...</option>
                    {CANAIS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo</label>
                  <select className="form-select" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                    <option value="">Selecionar...</option>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Seguidores</label>
                  <input className="form-input" type="number" value={form.seguidores} onChange={e => setForm(f => ({ ...f, seguidores: e.target.value }))} placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea className="form-textarea" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} placeholder="Notas sobre o parceiro..." />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.nome.trim()}>
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
