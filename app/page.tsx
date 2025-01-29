// src/app/page.jsx
import TextToSpeechGenerator from './components/TextToSpeechGenerator';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <TextToSpeechGenerator />
    </main>
  );
}