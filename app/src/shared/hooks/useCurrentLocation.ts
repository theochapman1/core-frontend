import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
export default () => {
    const { pathname } = useLocation()
    return useMemo(() => {
        if (pathname === '/') {
            return 'marketplace'
        }

        return pathname.split(/\//).filter(Boolean)[0] || 'core'
    }, [pathname])
}
