"use client";
import Button from "@/components/ui/Button";
import { useLayoutEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeSwitchProps {
  className?: string;
  sizeIcon: number;
  border?: boolean;
}

const ThemeSwitch = ({
  className,
  sizeIcon,
  border = true,
}: ThemeSwitchProps) => {
  const { theme, setTheme } = useTheme();
  const [disabled, setDisabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const didRun = useRef(false);

  useLayoutEffect(() => {
    if (!didRun.current) {
      didRun.current = true;
      setMounted(true);
    }
  }, []);

  const handleThemeChange = () => {
    if (disabled) return;

    setDisabled(true);
    setTheme(theme === "light" ? "dark" : "light");

    setTimeout(() => {
      setDisabled(false);
    }, 600);
  };

  return (
    <Button
      type="button"
      onToggle={handleThemeChange}
      disabled={disabled}
      suppressHydrationWarning
      className={`group flex justify-center items-center ${border ? "border border-ui-border p-3 md:p-2" : ""} rounded-4xl transition-all duration-300 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } ${border ? "hover:bg-gray-600" : ""} ${className}`}
      aria-label="Toggle Theme"
    >
      {!mounted ? (
        <span
          style={{
            width: sizeIcon,
            height: sizeIcon,
            display: "block",
          }}
        />
      ) : theme === "light" ? (
        <Moon
          size={sizeIcon}
          className={`text-black ${border ? "group-hover:text-white" : ""} duration-300 transition-transform`}
        />
      ) : (
        <Sun
          size={sizeIcon}
          className={`text-white duration-300 transition-transform`}
        />
      )}
    </Button>
  );
};

export default ThemeSwitch;
