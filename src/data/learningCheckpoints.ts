import checkpointData from '../../evidence/learning-checkpoints.json'

export type LearningCheckpoint = {
  id: string
  levelId: string
  prompt: { en: string; vi: string }
  options: Array<{ en: string; vi: string }>
  correctIndex: number
  explanation: { en: string; vi: string }
  links: Array<{ href: string; label: { en: string; vi: string } }>
}

export const learningCheckpoints = checkpointData as LearningCheckpoint[]
