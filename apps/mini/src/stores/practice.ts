import { defineStore } from 'pinia';

interface DraftState {
  practiceId?: string;
  topic: string;
  style: 'STRUCTURED' | 'STORY' | 'EXEC_SUMMARY';
  level: string;
  backgroundTagsText: string;
  outline: string;
  asrText: string;
  polishedText: string;
  changes: Array<{ reasonTag: string; reason: string; newText: string; type: string }>;
}

const STORAGE_KEY = 'practice-draft';

const defaultState: DraftState = {
  topic: '',
  style: 'STRUCTURED',
  level: 'P5',
  backgroundTagsText: 'SaaS,toB',
  outline: '',
  asrText: '',
  polishedText: '',
  changes: []
};

export const usePracticeStore = defineStore('practice', {
  state: (): DraftState => ({ ...defaultState }),
  actions: {
    restore() {
      const raw = uni.getStorageSync(STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        Object.assign(this, parsed);
      } catch (_err) {
        // ignore invalid local draft
      }
    },
    save() {
      uni.setStorageSync(
        STORAGE_KEY,
        JSON.stringify({
          practiceId: this.practiceId,
          topic: this.topic,
          style: this.style,
          level: this.level,
          backgroundTagsText: this.backgroundTagsText,
          outline: this.outline,
          asrText: this.asrText,
          polishedText: this.polishedText,
          changes: this.changes
        })
      );
    },
    reset() {
      Object.assign(this, defaultState);
      uni.removeStorageSync(STORAGE_KEY);
    }
  }
});
