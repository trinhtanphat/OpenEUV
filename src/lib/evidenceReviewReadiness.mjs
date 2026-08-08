export function summarizeEvidenceReviewReadiness({ claims = [], unknowns = [], registry, minimumReviewedRecords = 10 }) {
  const categoryById = new Map()
  for (const claim of claims) categoryById.set(claim.id, `Class ${claim.class}`)
  for (const unknown of unknowns) categoryById.set(unknown.id, 'Unknown')

  const reviewed = (registry?.reviews ?? []).filter((review) => review.state === 'reviewed')
  const reviewedCategories = Array.from(new Set(reviewed.map((review) => categoryById.get(review.id)).filter(Boolean))).sort()
  const availableCategories = Array.from(new Set(categoryById.values())).sort()
  const reviewedWithPublicReviewer = reviewed.filter((review) => Array.isArray(review.reviewers) && review.reviewers.length > 0)
  const missingReviewedRecords = Math.max(0, minimumReviewedRecords - reviewedWithPublicReviewer.length)

  return {
    minimumReviewedRecords,
    reviewedRecords: reviewedWithPublicReviewer.length,
    missingReviewedRecords,
    reviewedCategories,
    availableCategories,
    uncoveredCategories: availableCategories.filter((category) => !reviewedCategories.includes(category)),
    readyForMinimumCampaignCount: missingReviewedRecords === 0,
  }
}
