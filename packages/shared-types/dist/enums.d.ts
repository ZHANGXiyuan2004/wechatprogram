export declare enum Role {
    EMPLOYEE = "EMPLOYEE",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN"
}
export declare enum OutlineStyle {
    STRUCTURED = "STRUCTURED",
    STORY = "STORY",
    EXEC_SUMMARY = "EXEC_SUMMARY"
}
export declare enum PromptModule {
    OUTLINE = "OUTLINE",
    POLISH = "POLISH",
    COACH = "COACH",
    TEAM_INSIGHT = "TEAM_INSIGHT"
}
export declare enum DiffType {
    INSERT = "INSERT",
    DELETE = "DELETE",
    REPLACE = "REPLACE"
}
export declare enum DiffReasonTag {
    VERBAL_FIX = "\u53E3\u8BED\u5316\u4FEE\u6B63",
    LOGIC_LINK = "\u903B\u8F91\u8854\u63A5",
    BUSINESS_WORDING = "\u5546\u52A1\u8BCD\u66FF\u6362",
    REDUNDANCY_REMOVAL = "\u5197\u4F59\u5220\u9664"
}
export declare enum AsrJobStatus {
    PENDING = "PENDING",
    RUNNING = "RUNNING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    TIMEOUT = "TIMEOUT"
}
export declare enum PracticeStatus {
    DRAFT = "DRAFT",
    OUTLINE_DONE = "OUTLINE_DONE",
    RECORDING_DONE = "RECORDING_DONE",
    ASR_DONE = "ASR_DONE",
    POLISH_DONE = "POLISH_DONE"
}
