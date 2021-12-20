import { makeAutoObservable } from "mobx";
import HttpService from "../services/HttpService";

export interface IProcessModel {
    configurationSerialized: string | undefined;
    isDisabled: boolean;
    alias: string;
    id: string;
    type: string;

    setConfiguration(configurationSerialized: string) : void;
}

class ProcessModel implements IProcessModel {
    configurationSerialized: string | undefined;
    isDisabled: boolean;
    alias: string;
    id: string;
    type: string;

    constructor(type: string, id: string, alias: string, isDisabled: boolean, configurationSerialized?: string) {
        this.type = type;
        this.id = id;
        this.alias = alias;
        this.isDisabled = isDisabled;
        this.configurationSerialized = configurationSerialized;

        makeAutoObservable(this);
    }

    setConfiguration(configurationSerialized: string) {
        this.configurationSerialized = configurationSerialized;
    }
}

class SignalProcessDto {
    type?: string;
    id?: string;
    alias?: string;
    isDisabled?: boolean;
    configurationSerialized?: string;

    static FromDto(dto: SignalProcessDto): IProcessModel {
        if (dto.type == null || dto.id == null || dto.alias == null) {
            throw Error("Invalid SignalProcessDto - missing required properties.");
        }

        return new ProcessModel(dto.type, dto.id, dto.alias, dto.isDisabled ?? false, dto.configurationSerialized);
    }
}

export default class ProcessesRepository {
    private static processesCache?: IProcessModel[];
    private static processesCacheKeyed?: { [id: string]: IProcessModel };
    private static isLoading: boolean;

    static async saveProcessConfigurationAsync(id: string, configurationSerialized: string) {
        const process = await this.getProcessAsync(id);
        if (process == null)
            throw new Error("Invalid process identifier.");

        process.setConfiguration(configurationSerialized);

        const response = await HttpService.requestAsync("/processes/set", "post", process) as {id: string} | undefined;
        if (response?.id !== id)
            throw new Error("Not matching identifier received.");
    }

    static async getProcessAsync(id: string): Promise<IProcessModel | undefined> {
        await ProcessesRepository._cacheProcessesAsync();
        if (typeof ProcessesRepository.processesCacheKeyed !== 'undefined') {
            if (typeof ProcessesRepository.processesCacheKeyed[id] === "undefined")
                return undefined;
            return ProcessesRepository.processesCacheKeyed[id];
        }
        return undefined;
    }

    static async getProcessesAsync(): Promise<IProcessModel[]> {
        await ProcessesRepository._cacheProcessesAsync();
        return ProcessesRepository.processesCache ?? [];
    }

    private static async _cacheProcessesAsync() {
        // TODO: Invalidate cache after some period
        if (!ProcessesRepository.isLoading &&
            !ProcessesRepository.processesCache) {
            ProcessesRepository.isLoading = true;
            ProcessesRepository.processesCache = (await HttpService.getAsync<SignalProcessDto[]>("/processes")).map(SignalProcessDto.FromDto);
            ProcessesRepository.processesCacheKeyed = {};
            ProcessesRepository.processesCache.forEach(process => {
                if (ProcessesRepository.processesCacheKeyed)
                    ProcessesRepository.processesCacheKeyed[process.id] = process;
            });
            ProcessesRepository.processesCache.sort((a, b) => a.alias.toLowerCase() < b.alias.toLowerCase() ? -1 : (a.alias.toLowerCase() > b.alias.toLowerCase() ? 1 : 0));
            ProcessesRepository.isLoading = false;
        }

        // Wait to load
        while (ProcessesRepository.isLoading) {
            await new Promise(r => setTimeout(r, 10));
        }
    }
}