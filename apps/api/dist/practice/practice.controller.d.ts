import { Observable } from 'rxjs';
import { RequestUser } from '../common/request-user';
import { PracticeService } from './practice.service';
import { CreateAsrJobDto, CreatePracticeDto, GenerateOutlineDto, PolishDto, PresignRecordingDto } from './practice.dto';
export declare class PracticeController {
    private readonly service;
    constructor(service: PracticeService);
    createPractice(user: RequestUser, body: CreatePracticeDto): import("@asrllm/shared-types").Practice;
    generateOutline(id: string, body: GenerateOutlineDto): Promise<import("@asrllm/shared-types").OutlineGenerateResponse>;
    streamOutline(id: string): Observable<{
        data: unknown;
    }>;
    createRecordingPresign(id: string, body: PresignRecordingDto): {
        recordingId: string;
        uploadUrl: string;
        objectKey: string;
    };
    createAsrJob(id: string, body: CreateAsrJobDto): Promise<import("@asrllm/shared-types").AsrJob>;
    getAsrJob(id: string, jobId: string): import("@asrllm/shared-types").AsrJob;
    polish(id: string, body: PolishDto): Promise<import("@asrllm/shared-types").PolishResponse>;
}
