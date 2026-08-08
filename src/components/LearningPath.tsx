import { useState } from 'react'
import { LearningCheckpointCard } from './LearningCheckpointCard'
import { learningPath } from '../data/learningPath'
import type { Language } from '../i18n'

export function LearningPath({ language }: { language: Language }) {
  const [activeId, setActiveId] = useState(learningPath[0].id)
  const active = learningPath.find((item) => item.id === activeId) ?? learningPath[0]

  return (
    <section className="research-section learning-path" id="learning-path" data-language={language}>
      <div className="research-heading">
        <div>
          <span className="eyebrow">Basic → advanced</span>
          <h2>{language === 'vi' ? 'Lộ trình học EUV từ nền tảng đến nghiên cứu' : 'EUV learning path from foundations to research'}</h2>
          <p>{language === 'vi'
            ? 'Mỗi level nối kiến thức với lab tương tác, checkpoint tự kiểm tra và một loại contribution cụ thể, để người mới cũng có đường vào dự án.'
            : 'Each level connects theory to interactive labs, a self-check checkpoint and a concrete contributor path, giving beginners a clear way into the project.'}</p>
        </div>
        <div className="learning-level-badge"><strong>L{active.level}</strong><span>{active.id}</span></div>
      </div>

      <div className="learning-track" role="tablist" aria-label={language === 'vi' ? 'Các level học EUV' : 'EUV learning levels'}>
        {learningPath.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={item.id === active.id}
            data-learning-level={item.id}
            className={item.id === active.id ? 'active' : ''}
            onClick={() => setActiveId(item.id)}
          >
            <span>L{item.level}</span>
            <b>{item.title[language]}</b>
          </button>
        ))}
      </div>

      <article className="learning-detail" data-learning-active={active.id}>
        <div>
          <span className="learning-kicker">{language === 'vi' ? 'Mục tiêu' : 'Goal'}</span>
          <h3>{active.title[language]}</h3>
          <p>{active.goal[language]}</p>
        </div>
        <div className="learning-detail-grid">
          <div>
            <h4>{language === 'vi' ? 'Chủ đề' : 'Topics'}</h4>
            <ul>{active.topics[language].map((topic) => <li key={topic}>{topic}</li>)}</ul>
          </div>
          <div>
            <h4>{language === 'vi' ? 'Lab liên quan' : 'Related labs'}</h4>
            <div className="learning-labs">{active.labs.map((lab) => <span key={lab}>{lab}</span>)}</div>
          </div>
          <div>
            <h4>{language === 'vi' ? 'Contributor có thể làm gì?' : 'Contributor mission'}</h4>
            <p>{active.contribution[language]}</p>
          </div>
        </div>
      </article>

      <LearningCheckpointCard language={language} levelId={active.id} />
    </section>
  )
}
