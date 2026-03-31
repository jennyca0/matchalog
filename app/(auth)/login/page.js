'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
  };


  return (
            <><div>
          <label>
              Email:
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          </label>
          <label>
              Password:
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          </label>
          {error && <p>{error}</p>}
          <button onClick={handleLogin}>Log In</button>
      </div>
      <div>
        <p> Don't have an account? <Link href="/signup">Create one here</Link></p>
          </div>

</>
        )
}

export default LoginPage;