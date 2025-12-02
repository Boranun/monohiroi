'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, push, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Feedback, FEEDBACK_CATEGORIES } from '@/lib/types';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedback & Q&A',
  description: 'Share your feedback, feature requests, and questions about REPO Tracker. Help us improve the tool for the community.',
};

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'feature-request' | 'bug-report' | 'question' | 'other'>('feature-request');
  const [useJapanese, setUseJapanese] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('repo-tracker-language');
    if (savedLanguage === 'en') {
      setUseJapanese(false);
    }

    const feedbackRef = ref(database, 'feedback');
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const feedbackArray = Object.entries(data).map(([id, feedback]: [string, any]) => ({
          id,
          ...feedback,
        }));
        feedbackArray.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setFeedbacks(feedbackArray);
      } else {
        setFeedbacks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleLanguage = () => {
    const newValue = !useJapanese;
    setUseJapanese(newValue);
    localStorage.setItem('repo-tracker-language', newValue ? 'ja' : 'en');
  };

  const submitFeedback = async () => {
    if (!title.trim() || !content.trim()) return;

    const feedbackRef = ref(database, 'feedback');
    const newFeedbackRef = push(feedbackRef);
    
    const newFeedback: Omit<Feedback, 'id'> = {
      author: author.trim() || (useJapanese ? '匿名' : 'Anonymous'),
      title: title.trim(),
      content: content.trim(),
      category,
      timestamp: new Date().toISOString(),
    };

    await set(newFeedbackRef, newFeedback);

    setAuthor('');
    setTitle('');
    setContent('');
    setCategory('feature-request');
    setShowForm(false);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(useJapanese ? 'ja-JP' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryLabel = (cat: string) => {
    const category = FEEDBACK_CATEGORIES.find(c => c.value === cat);
    return useJapanese ? category?.label : category?.labelEn;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'feature-request':
        return 'bg-blue-600';
      case 'bug-report':
        return 'bg-red-600';
      case 'question':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredFeedbacks = filterCategory === 'all' 
    ? feedbacks 
    : feedbacks.filter(f => f.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <main className="flex-1 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                <Link 
                    href="/"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-2 transition text-sm"
                >
                    ← {useJapanese ? 'トップページに戻る' : 'Back to Home'}
                </Link>
                <Link href="/" className="inline-block hover:opacity-80 transition">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white cursor-pointer">
                    {useJapanese ? 'フィードバック・Q&A' : 'Feedback & Q&A'}
                    </h1>
                </Link>
                <p className="text-gray-400 mt-2 text-sm sm:text-base">
                    {useJapanese 
                    ? '機能リクエスト、バグ報告、質問などをお寄せください'
                    : 'Share feature requests, bug reports, questions, and more'}
                </p>
                </div>
                <button
                onClick={toggleLanguage}
                className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition touch-manipulation"
                >
                {useJapanese ? '🇯🇵 日本語' : '🇺🇸 English'}
                </button>
            </div>
            </div>

          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                {useJapanese ? '投稿' : 'Posts'}
              </h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                {showForm ? (useJapanese ? 'キャンセル' : 'Cancel') : (useJapanese ? '+ 新規投稿' : '+ New Post')}
              </button>
            </div>

            {showForm && (
              <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                <input
                  type="text"
                  placeholder={useJapanese ? '名前（任意）' : 'Name (optional)'}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none mb-3"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none mb-3"
                >
                  {FEEDBACK_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {useJapanese ? cat.label : cat.labelEn}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder={useJapanese ? 'タイトル' : 'Title'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none mb-3"
                />
                <textarea
                  placeholder={useJapanese ? '内容を入力してください' : 'Enter your message'}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none mb-3 resize-none"
                />
                <button
                  onClick={submitFeedback}
                  disabled={!title.trim() || !content.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  {useJapanese ? '投稿する' : 'Submit'}
                </button>
              </div>
            )}

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  filterCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {useJapanese ? 'すべて' : 'All'}
              </button>
              {FEEDBACK_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilterCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                    filterCategory === cat.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {useJapanese ? cat.label : cat.labelEn}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredFeedbacks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  {useJapanese ? 'まだ投稿がありません' : 'No posts yet'}
                </div>
              ) : (
                filteredFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="p-4 bg-gray-700 rounded-lg border border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getCategoryColor(feedback.category)}`}>
                          {getCategoryLabel(feedback.category)}
                        </span>
                        <span className="text-gray-400 text-sm">{formatDate(feedback.timestamp)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feedback.title}</h3>
                    <p className="text-gray-300 mb-2 whitespace-pre-wrap">{feedback.content}</p>
                    <div className="text-sm text-gray-400">
                      {useJapanese ? '投稿者:' : 'By:'} {feedback.author}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}