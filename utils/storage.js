import AsyncStorage from "@react-native-async-storage/async-storage"

const StorageKey = {
    PROFILE: 'profileData'
}

export const storage = {
    saveProfile: async (profileData) => {
        try {
            await AsyncStorage.setItem(StorageKey.PROFILE, JSON.stringify(profileData));
        } catch (error) {
            console.error('Error saving profile:',  error)
            throw error;
        }
    },
    getProfile: async () => {
        try {
            const data = await AsyncStorage.getItem(StorageKey.PROFILE);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading profile:', error)
        }
    },
    clearAll: async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error)
        }
    }
}