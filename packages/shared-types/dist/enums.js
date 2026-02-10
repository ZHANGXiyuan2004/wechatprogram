export var Role;
(function (Role) {
    Role["EMPLOYEE"] = "EMPLOYEE";
    Role["MANAGER"] = "MANAGER";
    Role["ADMIN"] = "ADMIN";
})(Role || (Role = {}));
export var OutlineStyle;
(function (OutlineStyle) {
    OutlineStyle["STRUCTURED"] = "STRUCTURED";
    OutlineStyle["STORY"] = "STORY";
    OutlineStyle["EXEC_SUMMARY"] = "EXEC_SUMMARY";
})(OutlineStyle || (OutlineStyle = {}));
export var PromptModule;
(function (PromptModule) {
    PromptModule["OUTLINE"] = "OUTLINE";
    PromptModule["POLISH"] = "POLISH";
    PromptModule["COACH"] = "COACH";
    PromptModule["TEAM_INSIGHT"] = "TEAM_INSIGHT";
})(PromptModule || (PromptModule = {}));
export var DiffType;
(function (DiffType) {
    DiffType["INSERT"] = "INSERT";
    DiffType["DELETE"] = "DELETE";
    DiffType["REPLACE"] = "REPLACE";
})(DiffType || (DiffType = {}));
export var DiffReasonTag;
(function (DiffReasonTag) {
    DiffReasonTag["VERBAL_FIX"] = "\u53E3\u8BED\u5316\u4FEE\u6B63";
    DiffReasonTag["LOGIC_LINK"] = "\u903B\u8F91\u8854\u63A5";
    DiffReasonTag["BUSINESS_WORDING"] = "\u5546\u52A1\u8BCD\u66FF\u6362";
    DiffReasonTag["REDUNDANCY_REMOVAL"] = "\u5197\u4F59\u5220\u9664";
})(DiffReasonTag || (DiffReasonTag = {}));
export var AsrJobStatus;
(function (AsrJobStatus) {
    AsrJobStatus["PENDING"] = "PENDING";
    AsrJobStatus["RUNNING"] = "RUNNING";
    AsrJobStatus["SUCCESS"] = "SUCCESS";
    AsrJobStatus["FAILED"] = "FAILED";
    AsrJobStatus["TIMEOUT"] = "TIMEOUT";
})(AsrJobStatus || (AsrJobStatus = {}));
export var PracticeStatus;
(function (PracticeStatus) {
    PracticeStatus["DRAFT"] = "DRAFT";
    PracticeStatus["OUTLINE_DONE"] = "OUTLINE_DONE";
    PracticeStatus["RECORDING_DONE"] = "RECORDING_DONE";
    PracticeStatus["ASR_DONE"] = "ASR_DONE";
    PracticeStatus["POLISH_DONE"] = "POLISH_DONE";
})(PracticeStatus || (PracticeStatus = {}));
