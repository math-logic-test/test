import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Moon, Sun, Search, MessageCircle } from 'lucide-react';

export default function ClientScripts() {
  const [theme, setTheme] = useState('light');
  const [search, setSearch] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.className = saved;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleComment = (e) => {
    e.preventDefault();
    const newComment = {
      id: Date.now(),
      text: e.target.comment.value,
      author: 'Anonymous',
      date: new Date().toISOString()
    };
    setComments([...comments, newComment]);
    e.target.reset();
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
        >
          {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={20} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mt-8">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-blue-600"
          >
            <MessageCircle size={16} />
            Comments
          </button>
        </div>

        {showComments && (
          <div className="mt-4">
            <form onSubmit={handleComment} className="mb-4">
              <textarea
                name="comment"
                placeholder="Write a comment..."
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                Post Comment
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {comments.map(comment => (
                <div key={comment.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                  <p className="text-sm text-gray-500">{comment.author} - {comment.date}</p>
                  <p className="mt-2">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}