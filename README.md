# HEERO Motors Chatbot Frontend

Frontend für den AI-gestützten eMobilität-Chatbot von HEERO Motors. Entwickelt mit React + Vite + TailwindCSS.

## Über HEERO Motors

HEERO Motors elektrifiziert Nutzfahrzeugflotten durch Diesel-to-Electric Umrüstungen und neue Elektrofahrzeuge. Unser Chatbot hilft bei Fragen zu:

- eTransporter und eBusse
- Reichweite und Ladeinfrastruktur  
- Förderungen und Finanzierung
- Flottenelektrifizierung
- CO2-Einsparungen

## Setup

1. **Repository klonen**
   ```bash
   git clone https://github.com/SCAILE-it/heero-chatbot-frontend.git
   cd heero-chatbot-frontend
   ```

2. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Erstelle eine `.env`-Datei im Root-Verzeichnis:
   ```
   VITE_API_URL=your_api_endpoint_here
   ```

4. **Lokalen Dev-Server starten**
   ```bash
   npm run dev
   ```

   ## Embeddable Chat Widget (new)

   This project now includes a compact Chat Widget suitable for embedding on any website. The widget is exposed at the root page and provides a floating chat bubble that lazy-loads the chat panel.

   How to deploy:

   1. Deploy this repo (or a branch) to Vercel. Make sure `VITE_API_URL` is set in Project > Environment Variables.
   2. The widget will be available at the deployment URL (e.g. `https://your-widget.vercel.app`).

   Embed via iframe:

   ```html
   <iframe src="https://your-widget.vercel.app" style="position:fixed;bottom:16px;right:16px;width:360px;height:520px;border-radius:16px;border:none;box-shadow:0 10px 30px rgba(0,0,0,0.15);z-index:99999;" />
   ```

   Embed as React component:

   1. In your React app insert an iframe (see above) or copy the `ChatWidget` component into your project and render it.
   2. If you copy the component, ensure you also bring the required styles and `useChatState` hook and set `VITE_API_URL` or pass `apiUrl` prop.

   Notes & optional enhancements:
   - The chat panel is lazy-loaded to minimize initial page weight.
   - Messages auto-scroll to the latest message. New messages have a subtle animation.
   - For a drop-in script, we can prepare a lightweight mount script that injects the widget into host pages and sandbox it inside an iframe.

