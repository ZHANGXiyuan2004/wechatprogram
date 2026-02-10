export enum Role {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export enum OutlineStyle {
  STRUCTURED = 'STRUCTURED',
  STORY = 'STORY',
  EXEC_SUMMARY = 'EXEC_SUMMARY'
}

export enum PromptModule {
  OUTLINE = 'OUTLINE',
  POLISH = 'POLISH',
  COACH = 'COACH',
  TEAM_INSIGHT = 'TEAM_INSIGHT'
}

export enum DiffType {
  INSERT = 'INSERT',
  DELETE = 'DELETE',
  REPLACE = 'REPLACE'
}

export enum DiffReasonTag {
  VERBAL_FIX = '口语化修正',
  LOGIC_LINK = '逻辑衔接',
  BUSINESS_WORDING = '商务词替换',
  REDUNDANCY_REMOVAL = '冗余删除'
}

export enum AsrJobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT'
}

export enum PracticeStatus {
  DRAFT = 'DRAFT',
  OUTLINE_DONE = 'OUTLINE_DONE',
  RECORDING_DONE = 'RECORDING_DONE',
  ASR_DONE = 'ASR_DONE',
  POLISH_DONE = 'POLISH_DONE'
}
