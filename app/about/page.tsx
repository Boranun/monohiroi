import Link from 'next/link';
import { Metadata } from 'next';


export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition"
            >
            ← トップページに戻る
            </Link>

            <Link href="/" className="inline-block hover:opacity-80 transition">
            <h1 className="text-4xl font-bold text-white mb-8">Monohiroi - 免責事項・著作権について</h1>
            </Link>
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">著作権・商標権について</h2>
              <div className="space-y-3 bg-gray-700 p-6 rounded-lg border border-gray-600">
                <p className="leading-relaxed">
                  <strong className="text-white">REPO</strong>は、その開発元・販売元の登録商標または商標です。
                </p>
                <p className="leading-relaxed">
                  当サイト「REPO Tracker」は、個人が運営する非公式のWebサービスであり、
                  ゲームの開発元・販売元、その他関連企業とは一切関係ありません。
                </p>
                <p className="leading-relaxed">
                  ゲーム内の名称、画像、データ等の著作権・商標権は、
                  それぞれの権利保有者に帰属します。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">当サイトについて</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  Monohiroiは、ゲーム「REPO」をプレイする際に、
                  プレイヤー間で能力値を共有・管理するための補助ツールです。
                </p>
                <p className="leading-relaxed">
                  本サイトは、ファンの一人として制作した非営利の個人プロジェクトであり、
                  ゲームの楽しさを向上させることを目的としています。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">免責事項</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  当サイトの利用により生じたいかなる損害についても、
                  運営者は一切の責任を負いかねます。
                </p>
                <p className="leading-relaxed">
                  当サイトに掲載されている情報の正確性については、
                  可能な限り注意を払っておりますが、
                  その完全性・正確性を保証するものではありません。
                </p>
                <p className="leading-relaxed">
                  予告なくサイトの内容を変更・削除する場合がございます。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">データの取り扱い</h2>
              <div className="space-y-3">
                <p className="leading-relaxed">
                  当サイトでは、以下の技術を使用してデータを保存しています：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>ブラウザのLocalStorage（ルーム履歴、言語設定等）</li>
                  <li>Firebase Realtime Database（プレイヤー能力値の共有）</li>
                </ul>
                <p className="leading-relaxed">
                  保存されるデータは、サービスの提供に必要な最小限のものであり、
                  個人を特定できる情報は収集していません。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">お問い合わせ</h2>
              <p className="leading-relaxed">
                当サイトに関するお問い合わせや、
                権利者の方からの削除要請等がございましたら、
                適切に対応いたします。
              </p>
            </section>

            <section className="border-t border-gray-700 pt-6">
              <p className="text-sm text-gray-400 leading-relaxed">
                下記は当サイト独自の内容に関する著作権を示すものです。<br />
                © 2025 Monohiroi
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}