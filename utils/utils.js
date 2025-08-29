import { storage } from "./storage"

export const getProfileNameInitials = async () => {
    const {firstName, lastName} = await storage.getProfile()
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
}
