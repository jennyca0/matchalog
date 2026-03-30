'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const supabase = createClient()

  useEffect(() => {
  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
      setUser({ ...user, username: profile?.username })
    }
  }
  getUser()
}, [])


return (
<nav className="topnav">
        <div className="nav-wrapper">
            <Link href={`/`} className="nav-logo">MatchaLog</Link>
          <ul>
            <li><Link href={`/`} className="nav-link">Discover</Link></li>
            <li><Link href="/stash">Stash</Link></li>
            <li><Link href={`/recipes`} className="nav-linkRecipes">Recipes</Link></li>
            <li><Link href={"profile/${user?.username"}>Profile</Link></li>
          </ul>
        </div>
      </nav>

)
}
