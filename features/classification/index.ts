/**
 * Classification Feature - Public API
 */

// Components
export { ConfidenceBadge } from './components/ConfidenceBadge'
export { ConfidenceMeter } from './components/ConfidenceMeter'
export { ClassificationResult } from './components/ClassificationResult'

// Hooks
export { useClassification } from './hooks/useClassification'

// Types
export type { ClassificationResult as ClassificationResultType } from './types'

// Constants
export { CLASSIFICATION_CONSTANTS } from './constants'

// Utils
export { getConfidenceColor, isHighConfidence } from './utils'
