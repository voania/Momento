export { getAiPipeline } from './pipeline';
export type { IAiProcessor } from './pipeline';
export { findDuplicates, computeSimilarity } from './dedup';
export type { DedupResult } from './dedup';
export { parseIntent } from './nlu/parser';
export type { ParsedIntent } from './nlu/parser';
export { loadEmbeddingModel, embedText, cosineSimilarity } from './embedding';
