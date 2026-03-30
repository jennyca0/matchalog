import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request) {
    const { searchParams, origin } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    const redirectResponse = NextResponse.redirect(`${origin}/`) //attach cookies to redirect before returning it 

    if (token_hash && type) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
        
        if (!error && data.session) {
            redirectResponse.cookies.set('sb-access-token', data.session.access_token, {
                httpOnly: true,
                secure: false, // set to true in production bc local host doens't use http
                sameSite: 'lax',
                maxAge: data.session.expires_in
            })
            redirectResponse.cookies.set('sb-refresh-token', data.session.refresh_token, {
                httpOnly: true,
                secure: false, // set to true in production
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 30
            })
        }
    }

    return redirectResponse
}