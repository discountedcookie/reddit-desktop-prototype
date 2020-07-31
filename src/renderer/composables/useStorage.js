export default function useStorage() {
  return {
    setItem: (key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    getItem: async (key, defaultValue) => {
      const item = await localStorage.getItem(key);
      return JSON.parse(item) || defaultValue;
    },
  };
}
