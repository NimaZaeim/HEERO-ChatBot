// This component represents the footer of a chat interface.
// It includes links to privacy policy and imprint, and a disclaimer about AI-generated responses.

const ChatFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 py-2 px-2 md:px-4 bg-transparent text-center text-xs text-[color:var(--neutral-grey)]">
      <div className="flex justify-center space-x-3">
        <p className="mb-1">
          Antworten einer KI. Infos bitte prüfen.
        </p>
        <a
          href="https://www.heero-motors.de/datenschutz"
          className="hover:text-[color:var(--secondary-accent)]"
        >
          Datenschutz
        </a>
        <a
          href="https://www.heero-motors.de/impressum"
          className="hover:text-[color:var(--secondary-accent)]"
        >
          Impressum
        </a>
      </div>
    </footer>
  );
};

export default ChatFooter;
