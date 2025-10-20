// This page displays a 404 Not Found error when a user attempts to access a non-existent route.
// It logs the error to the console and provides a button to redirect the user back to the chat page.

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-[color:var(--neutral-dark)] mb-4">Oops! Diese Seite existiert nicht.</p>
              <Button
        asChild
        variant="default"
        className="text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2"
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zum Chat
          <IconArrowUpRight size={14} stroke={2} className="ml-1" />
        </a>
      </Button>
      </div>
    </div>
  );
};

export default NotFound;
