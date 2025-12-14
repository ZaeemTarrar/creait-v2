import React, { useEffect } from "react";

const FontLoader: React.FC = () => {
  useEffect(() => {
    // Load Inter font from @fontsource
    import("@fontsource/inter/300.css");
    import("@fontsource/inter/400.css");
    import("@fontsource/inter/500.css");
    import("@fontsource/inter/600.css");
    import("@fontsource/inter/700.css");

    // Load Material Icons
    import("material-icons/iconfont/material-icons.css");

    // Optional: Load Material Symbols if needed
    // import('@fontsource/material-symbols-outlined');
  }, []);

  return null; // This component doesn't render anything
};

export default FontLoader;
