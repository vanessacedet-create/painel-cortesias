import { useEffect, useState } from 'react'
import { getEnvios, createEnvio, updateEnvio, deleteEnvio, getParceiros, getLivros } from '../lib/supabase'
import { Plus, Pencil, Trash2, X, CheckCircle, Clock, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS_OPTIONS = [
  { value: 'enviado',   label: 'Enviado',   icon: Clock,        cls: 'badge-amber' },
  { value: 'divulgado', label: 'Divulgado', icon: CheckCircle,  cls: 'badge-green' },
  { value: 'cancelado', label: 'Cancelado', icon: XCircle,      cls: 'badge-red'   },
]

const EMPTY = { parceiro_id: '', livro_id: '', status: 'enviado', data_envio: '', observacoes: '' }

export default function Envios() {
  const [envios, setEnvios]       = useState([])
  const [parceiros, setParceiros] = useState([])
  const [livros, setLivros]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [saving, setSaving]       = useState(false)
  const [filter, setFilter]       = useState('todos')
  const [search, setSearch]       = useState('')
  const [toast, setToast]         = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const [e, p, l] = await Promise.all([getEnvios(), getParceiros(), getLivros()])
      setEnvios(e); setParceiros(p); setLivros(l)
    } catch (e) { showToast('Erro ao carregar dados', 'error') }
    finally { setLoading(false) }
  }

  function openNew() {
    setEditing(null)
    setForm({ ...EMPTY, data_envio: new Date().toISOString().slice(0, 10) })
    setModal(true)
  }

  function openEdit(e) {
    setEditing(e)
    setForm({
      parceiro_id: e.parceiro_id,
      livro_id: e.livro_id,
      status: e.status,
      data_envio: e.data_envio || '',
      observacoes: e.observacoes || '',
    })
    setModal(true)
  }

  function closeModal() { setModal(false); setEditing(null) }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleSave() {
    if (!form.parceiro_id || !form.livro_id) return
    setSaving(true)
    try {
      if (editing) {
        const updated = await updateEnvio(editing.id, form)
        setEnvios(prev => prev.map(e => e.id === updated.id ? updated : e))
        showToast('Envio atualizado!')
      } else {
        const novo = await createEnvio(form)
        setEnvios(prev => [novo, ...prev])
        showToast('Envio registrado!')
      }
      closeModal()
    } catch (e) {
      showToast('Erro ao salvar envio', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir este envio?')) return
    try {
      await deleteEnvio(id)
      setEnvios(prev => prev.filter(e => e.id !== id))
      showToast('Envio excluído!')
    } catch (e) {
      showToast('Erro ao excluir', 'error')
    }
  }

  async function quickStatus(envio, novoStatus) {
    try {
      const updated = await updateEnvio(envio.id, { ...envio, status: novoStatus })
      setEnvios(prev => prev.map(e => e.id === updated.id ? updated : e))
      showToast('Status atualizado!')
    } catch (e) {
      showToast('Erro ao atualizar status', 'error')
    }
  }

  const filtered = envios
    .filter(e => filter === 'todos' || e.status === filter)
    .filter(e => {
      const q = search.toLowerCase()
      return (
        (e.parceiros?.nome || '').toLowerCase().includes(q) ||
        (e.livros?.titulo || '').toLowerCase().includes(q)
      )
    })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Envios</h1>
          <p className="page-subtitle">{envios.length} envio{envios.length !== 1 ? 's' : ''} registrado{envios.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Registrar Envio
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div style={{ display: 'flex', gap: 6 }}>
            {['todos', 'enviado', 'divulgado', 'cancelado'].map(f => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setFilter(f)}
                style={{ textTransform: 'capitalize' }}
              >
                {f === 'todos' ? 'Todos' : STATUS_OPTIONS.find(s => s.value === f)?.label}
              </button>
            ))}
          </div>
          <input
            className="search-input"
            placeholder="Buscar parceiro ou livro..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /><span>Carregando...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>{search || filter !== 'todos' ? 'Nenhum envio encontrado.' : 'Nenhum envio registrado ainda.'}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Parceiro</th>
                <th>Livro</th>
                <th>Data Envio</th>
                <th>Status</th>
                <th>Ação Rápida</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const s = STATUS_OPTIONS.find(x => x.value === e.status) || STATUS_OPTIONS[0]
                return (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 500 }}>{e.parceiros?.nome || '—'}</td>
                    <td className="td-muted">{e.livros?.titulo || '—'}</td>
                    <td className="td-muted">
                      {e.data_envio
                        ? format(new Date(e.data_envio + 'T12:00:00'), "dd MMM yyyy", { locale: ptBR })
                        : '—'}
                    </td>
                    <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                    <td>
                      {e.status === 'enviado' && (
                        <button
                          className="btn btn-sm btn-ghost"
                          style={{ color: 'var(--green)', fontSize: 12 }}
                          onClick={() => quickStatus(e, 'divulgado')}
                        >
                          ✓ Confirmar divulgação
                        </button>
                      )}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(e)} title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={() => handleDelete(e.id)} title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={ev => ev.target === ev.currentTarget && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Editar Envio' : 'Registrar Envio'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16} /></button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Parceiro *</label>
                <select className="form-select" value={form.parceiro_id} onChange={e => setForm(f => ({ ...f, parceiro_id: e.target.value }))}>
                  <option value="">Selecionar parceiro...</option>
                  {parceiros.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Livro *</label>
                <select className="form-select" value={form.livro_id} onChange={e => setForm(f => ({ ...f, livro_id: e.target.value }))}>
                  <option value="">Selecionar livro...</option>
                  {livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Data do Envio</label>
                  <input className="form-input" type="date" value={form.data_envio} onChange={e => setForm(f => ({ ...f, data_envio: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea className="form-textarea" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} placeholder="Notas sobre este envio..." />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.parceiro_id || !form.livro_id}>
                {saving ? 'Salvando...' : editing ? 'Salvar' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </div>
  )
}
