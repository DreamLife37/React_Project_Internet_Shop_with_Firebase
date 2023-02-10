export const getStoreLocal = (name: string) => {
    if (typeof localStorage !== 'undefined') {
        const ls = localStorage.getItem(name)
        return ls ? JSON.parse(ls) : null
    }
    return null
}

export const saveToStorage = (email: string) => {
    localStorage.setItem('email', JSON.stringify(email))
}