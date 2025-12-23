import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { AIService, ApiKeys, ChatMessage } from './services/AIService';

// AGENTS.md §11: UI/UX - Key Icon for visual flair
const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-gray-400" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-2l1-1 1-1-1.257-1.257A6 6 0 1118 8zm-6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
  </svg>
);

// AGENTS.md §11: UI/UX - Kinetic Physics based Loading Spinner
const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
);

function App() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    cerebras: '', gemini: '', deepseek: '', openrouter: '', mistral: '', together: '', groq: '',
  });
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentProvider, setCurrentProvider] = useState('');
  const [isKeysSaved, setIsKeysSaved] = useState(false);

  useEffect(() => {
    const savedKeys = localStorage.getItem('ai-api-keys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleSaveApiKeys = () => {
    localStorage.setItem('ai-api-keys', JSON.stringify(apiKeys));
    setIsKeysSaved(true);
    setTimeout(() => setIsKeysSaved(false), 2000); // Hide message after 2s
  };

  const handleApiKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || Object.values(apiKeys).every(key => !key.trim())) {
      setError('Please enter a prompt and at least one API key.');
      return;
    }

    setIsLoading(true);
    setResponse('');
    setError('');
    setCurrentProvider('Initializing...');

    const aiService = new AIService(apiKeys);
    const messages: ChatMessage[] = [{ role: 'user', content: prompt }];

    try {
      const result = await aiService.chat(messages);
      setResponse(result.content);
      setCurrentProvider(result.provider);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
      setResponse('');
      setCurrentProvider('Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-500">
            Spatial-Adaptive AI Interface
          </h1>
          <p className="text-gray-400 mt-2">AGENTS.md §11 Compliant UI/UX</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20">
            <h2 className="text-2xl font-semibold mb-4 flex items-center"><KeyIcon /> API Keys</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {Object.keys(apiKeys).map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-300 capitalize">{key}</label>
                  <input
                    type="password"
                    id={key}
                    name={key}
                    value={apiKeys[key as keyof ApiKeys]}
                    onChange={handleApiKeyChange}
                    className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder={`Enter ${key} API Key`}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleSaveApiKeys}
              className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {isKeysSaved ? 'Saved!' : 'Save Keys'}
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20">
              <form onSubmit={handleSubmit}>
                <label htmlFor="prompt" className="block text-lg font-semibold text-gray-200">Your Request</label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-2 block w-full h-36 bg-white/10 border border-white/20 rounded-md shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="e.g., Explain the theory of relativity in simple terms..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? 'Processing...' : 'Generate Response'}
                </button>
              </form>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 min-h-[24rem] transition-all duration-300 hover:border-white/20">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">AI Response</h3>
              <div className="p-1.5 rounded-md bg-white/5 text-xs text-gray-300 inline-block mb-4">
                Provider Status: <span className="font-mono text-cyan-400">{currentProvider || 'Idle'}</span>
              </div>

              {isLoading && (
                <div className="flex justify-center items-center h-48">
                  <LoadingSpinner />
                </div>
              )}

              {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg font-mono">{error}</div>}

              {response && (
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{response}</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
