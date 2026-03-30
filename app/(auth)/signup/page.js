'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const router = useRouter()
    const supabase = createClient()


async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: '${window.location.origin}/auth/callback',
    },
  })

  if (error) {
    setError(error.message)
  } else {
    setError('Check your email to confirm your account!')
  }
}

return (
            <div>
              <label>
                Email:
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
              </label>
              <label>
                Password:
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
              </label>
            {error && <p>{error}</p>}
            <button onClick={signUpNewUser}>Sign Up</button>
            </div>

        )

}
export default SignUpPage;