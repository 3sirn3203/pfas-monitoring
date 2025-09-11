export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#eef6ff", 100:"#daeafe", 500:"#3b82f6", 600:"#2563eb", 700:"#1d4ed8"
        }
      },
      boxShadow: {
        card: "0 4px 16px rgba(0,0,0,.06)"
      },
      borderRadius: {
        xl2: "1rem"
      },
      fontFamily: {
        sans: ["Inter","Noto Sans KR","system-ui","sans-serif"]
      }
    },
  },
  plugins: [],
}