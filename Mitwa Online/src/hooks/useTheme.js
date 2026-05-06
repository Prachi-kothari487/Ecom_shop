import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState("normal");

  useEffect(() => {
    const month = new Date().getMonth();
    if (month === 9 || month === 10) setTheme("diwali");
    else if (month === 11) setTheme("christmas");
    else setTheme("normal");
  }, []);

  return theme;
}
