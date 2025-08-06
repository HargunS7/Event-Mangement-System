// pages/CompleteProfile.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function CompleteProfile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    username: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return navigate('/login')
      setUser(user)
    })
  }, [navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Check if username already exists
    const { data: exists } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', form.username)
      .single()

    if (exists) {
      setError('Username already taken')
      setLoading(false)
      return
    }

    // Insert profile
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: user.id,
          ...form,
        },
      ])

    if (insertError) {
      setError(insertError.message)
    } else {
      navigate('/dashboard')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="username"
          placeholder="Username (unique)"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
