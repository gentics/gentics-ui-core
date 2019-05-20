import { InjectionToken } from '@angular/core';

/* Default values */
export const defaultConfig: Config = {
    dropDownPageMargin: 50,
    dropDownMaxHeight: 650
}

export interface Config {
    dropDownPageMargin?: number;
    dropDownMaxHeight?: number;
}

export type optionsConfig = Partial<Config>;
export const ConfigService: InjectionToken<Config> = new InjectionToken('ConfigService');
export const CustomConfig: InjectionToken<Config> = new InjectionToken('CustomConfig');
export const PredefinedConfig: InjectionToken<Config> = new InjectionToken('PredefinedConfig');

export function configFactory(
    initConfig: optionsConfig,
    configValue: optionsConfig | (() => optionsConfig)
): optionsConfig {
    return configValue instanceof Function ? { ...initConfig, ...configValue() } : { ...initConfig, ...configValue };
}