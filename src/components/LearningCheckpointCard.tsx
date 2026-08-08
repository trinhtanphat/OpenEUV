import { useMemo, useState } from 'react'
import { learningCheckpoints } from '../data/learningCheckpoints'
import type { Language } from '../i18n'

export function LearningCheckpointCard({ language, levelId }: { language: Language; levelId: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const checkpoint = useMemo(() => learningCheckpoints.find((item) => item.levelId === levelId), [levelId])
  if (!checkpoint) return null

  const selectedIndex = answers[checkpoint.id]
  const answered = Number.isInteger(selectedIndex)
  const correct = answered && selectedIndex === checkpoint.correctIndex
  const completed = Object.keys(answers).length

  return (
    <section className="learning-checkpoint" data-learning-checkpoint={checkpoint.id} aria-label={language === 'vi' ? 'Checkpoint kiến thức' : 'Learning checkpoint'}>
      <div className="checkpoint-heading">
        <div><span>{language === 'vi' ? 'Tự kiểm tra' : 'Knowledge check'}</span><strong>{checkpoint.prompt[language]}</strong></div>
        <small>{completed}/{learningCheckpoints.length} {language === 'vi' ? 'đã trả lời trong session' : 'answered this session'}</small>
      </div>
      <div className="checkpoint-options" role="group" aria-label={checkpoint.prompt[language]}>
        {checkpoint.options.map((option, index) => {
          const selected = selectedIndex === index
          return <button
            key={`${checkpoint.id}-${index}`}
            type="button"
            data-checkpoint-option={index}
            aria-pressed={selected}
            className={selected ? 'selected' : ''}
            onClick={() => setAnswers((current) => ({ ...current, [checkpoint.id]: index }))}
          >
            <span>{String.fromCharCode(65 + index)}</span>{option[language]}
          </button>
        })}
      </div>
      {answered && <div className={`checkpoint-feedback ${correct ? 'correct' : 'review'}`} role="status" data-checkpoint-result={correct ? 'correct' : 'review'}>
        <strong>{correct ? (language === 'vi' ? 'Đúng — tiếp tục đào sâu evidence.' : 'Correct — keep following the evidence.') : (language === 'vi' ? 'Chưa đúng — xem giải thích rồi thử lại.' : 'Not yet — review the explanation and try again.')}</strong>
        <p>{checkpoint.explanation[language]}</p>
        <div>{checkpoint.links.map((link) => <a key={`${checkpoint.id}-${link.href}`} href={link.href}>{link.label[language]} ↗</a>)}</div>
      </div>}
      <p className="checkpoint-privacy">{language === 'vi' ? 'Progress chỉ nằm trong state của trang hiện tại; OpenEUV không gửi hoặc lưu câu trả lời.' : 'Progress exists only in the current page state; OpenEUV does not send or persist your answers.'}</p>
    </section>
  )
}
