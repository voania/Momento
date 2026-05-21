// ============================================================
// AI 处理管线 — 批量分析照片
// 接口设计：queuePhotos() 入队 → processNext() 逐张调 ML Kit
// 后期替换：接入真实 ML Kit / TFLite 模型
// ============================================================

import { useAiStore } from '../store';
import type { AiAnalysisResult, Photo } from '../types';

// ---- AI 处理接口（后期各模块实现此接口）----
export interface IAiProcessor {
  readonly name: string;
  analyze(photo: Photo): Promise<Partial<AiAnalysisResult>>;
}

// ---- 管线调度器 ----
class AiPipeline {
  private queue: string[] = [];
  private running = false;
  private processors: IAiProcessor[] = [];

  registerProcessor(processor: IAiProcessor): void {
    this.processors.push(processor);
  }

  async queuePhotos(photos: Photo[]): Promise<void> {
    const ids = photos.map((p) => p.id);
    this.queue.push(...ids);
    useAiStore.getState().startPipeline([...this.queue]);
    if (!this.running) {
      this.running = true;
      this.processQueue(photos);
    }
  }

  private async processQueue(allPhotos: Photo[]): Promise<void> {
    const photoMap = new Map(allPhotos.map((p) => [p.id, p]));

    while (this.queue.length > 0) {
      const id = this.queue.shift()!;
      const photo = photoMap.get(id);
      if (!photo) continue;

      useAiStore.getState().setCurrentPhoto(id);

      try {
        // 串行调所有 processor，合并结果
        const partials = await Promise.all(
          this.processors.map((proc) =>
            proc.analyze(photo).catch((err): Partial<AiAnalysisResult> => {
              console.warn(`[AI] ${proc.name} failed for ${id}:`, err);
              return {};
            }),
          ),
        );

        const result: AiAnalysisResult = {
          photoId: id,
          labels: [],
          category: 'other',
          faceCount: 0,
          textBlocks: [],
        };

        for (const p of partials) {
          if (p.labels) result.labels.push(...p.labels);
          if (p.category) result.category = p.category;
          if (p.faceCount) result.faceCount = p.faceCount;
          if (p.textBlocks) result.textBlocks.push(...p.textBlocks);
          if (p.embedding) result.embedding = p.embedding;
        }

        // 去重
        result.labels = [...new Set(result.labels)];

        useAiStore.getState().reportResult(result);
      } catch (err: any) {
        useAiStore.getState().reportError({
          photoId: id,
          message: err?.message || 'Unknown error',
          timestamp: Date.now(),
        });
      }
    }

    this.running = false;
    useAiStore.getState().setCurrentPhoto(undefined);
  }

  stop(): void {
    this.queue.length = 0;
    this.running = false;
    useAiStore.getState().stopPipeline();
  }
}

// 单例
let pipeline: AiPipeline | null = null;

export function getAiPipeline(): AiPipeline {
  if (!pipeline) pipeline = new AiPipeline();
  return pipeline;
}
